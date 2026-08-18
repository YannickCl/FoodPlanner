"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { setMealSchema, generateSchema } from "@/lib/validation";
import {
  isoToDbDate,
  dbDateToISO,
  fromISO,
  toISO,
  rangeISO,
  addDays,
} from "@/lib/dates";
import { generatePlan, type Slot, type ExistingMeal } from "@/lib/generate";
import { getSettings } from "@/lib/queries";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { hasRestrictedIngredient } from "@/lib/restrictions";

/** Upsert (ou effacement) d'un repas sur un créneau. */
export async function setMeal(input: unknown) {
  const data = setMealSchema.parse(input);
  const householdId = await getCurrentHouseholdId();
  const date = isoToDbDate(data.date);
  const choices = data.choices ?? undefined;

  if (data.recipeId === null) {
    await prisma.plannedMeal.deleteMany({
      where: { householdId, date, mealTime: data.mealTime },
    });
  } else {
    // Isolation : la recette doit appartenir au foyer courant (sinon on pourrait
    // lier — et lire via les jointures calendrier/courses — la recette d'un autre foyer).
    const owned = await prisma.recipe.findFirst({
      where: { id: data.recipeId, householdId },
      select: { id: true },
    });
    if (!owned) return { ok: false, error: "Recette introuvable." };

    await prisma.plannedMeal.upsert({
      where: {
        householdId_date_mealTime: { householdId, date, mealTime: data.mealTime },
      },
      create: {
        householdId,
        date,
        mealTime: data.mealTime,
        recipeId: data.recipeId,
        servings: data.servings,
        choices,
      },
      update: {
        recipeId: data.recipeId,
        servings: data.servings,
        choices,
        remindedAt: null, // nouveau plat -> le rappel pourra repartir
        preparedAt: null, // ...et il n'est plus "préparé à l'avance"
        storage: null,
      },
    });
  }

  revalidatePath("/calendrier");
  revalidatePath("/courses");
  return { ok: true };
}

/** Supprime plusieurs repas d'un coup (mode sélection du calendrier). */
export async function clearMeals(
  cells: { date: string; mealTime: "MIDI" | "SOIR" }[],
) {
  const valid = (cells ?? []).filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.date));
  if (!valid.length) return { ok: true, count: 0 };

  const householdId = await getCurrentHouseholdId();
  await prisma.$transaction(
    valid.map((c) =>
      prisma.plannedMeal.deleteMany({
        where: { householdId, date: isoToDbDate(c.date), mealTime: c.mealTime },
      }),
    ),
  );

  revalidatePath("/calendrier");
  revalidatePath("/courses");
  return { ok: true, count: valid.length };
}

/** Génère le planning sur une période (mode "fill" ou "replace"). */
export async function generatePlanning(input: unknown) {
  const { from, to, mode } = generateSchema.parse(input);

  const householdId = await getCurrentHouseholdId();
  const settings = await getSettings();
  const restrictions = [...settings.allergies, ...settings.forbidden];

  const allRecipes = await prisma.recipe.findMany({
    where: { householdId },
    select: {
      id: true,
      name: true,
      containsStarch: true,
      starchFamily: true,
      season: true,
      mealTime: true,
      dayType: true,
      minGapDays: true,
      ingredients: { select: { name: true } },
    },
  });

  // Exclut les recettes contenant un allergène / aliment interdit.
  const recipes = allRecipes
    .filter(
      (r) =>
        !hasRestrictedIngredient(
          r.ingredients.map((i) => i.name),
          restrictions,
        ),
    )
    .map((r) => ({
      id: r.id,
      name: r.name,
      containsStarch: r.containsStarch,
      starchFamily: r.starchFamily,
      season: r.season,
      mealTime: r.mealTime,
      dayType: r.dayType,
      minGapDays: r.minGapDays,
    }));

  // Contexte : repas des 90 jours précédant la période, pour respecter les gaps.
  const preStart = toISO(addDays(fromISO(from), -90));
  const preEnd = toISO(addDays(fromISO(from), -1));

  const contextRows = await prisma.plannedMeal.findMany({
    where: {
      householdId,
      date: { gte: isoToDbDate(preStart), lte: isoToDbDate(preEnd) },
      recipeId: { not: null },
    },
    select: { date: true, mealTime: true, recipeId: true },
  });

  const existing: ExistingMeal[] = contextRows.map((r) => ({
    date: dbDateToISO(r.date),
    mealTime: r.mealTime as "MIDI" | "SOIR",
    recipeId: r.recipeId,
  }));

  // En mode "fill", on ajoute les repas déjà posés DANS la période pour les
  // conserver et en tenir compte (gaps + familles).
  if (mode === "fill") {
    const inRange = await prisma.plannedMeal.findMany({
      where: { householdId, date: { gte: isoToDbDate(from), lte: isoToDbDate(to) } },
      select: { date: true, mealTime: true, recipeId: true },
    });
    for (const r of inRange) {
      existing.push({
        date: dbDateToISO(r.date),
        mealTime: r.mealTime as "MIDI" | "SOIR",
        recipeId: r.recipeId,
      });
    }
  }

  const slots: Slot[] = rangeISO(from, to).flatMap((d) => [
    { date: d, mealTime: "MIDI" },
    { date: d, mealTime: "SOIR" },
  ]);

  const assignments = generatePlan({ slots, recipes, existing, mode });

  await prisma.$transaction(async (tx) => {
    if (mode === "replace") {
      // Tout régénérer : on efface la période (du foyer) puis on réécrit.
      await tx.plannedMeal.deleteMany({
        where: { householdId, date: { gte: isoToDbDate(from), lte: isoToDbDate(to) } },
      });
      if (assignments.length) {
        await tx.plannedMeal.createMany({
          data: assignments.map((a) => ({
            householdId,
            date: isoToDbDate(a.date),
            mealTime: a.mealTime,
            recipeId: a.recipeId,
            servings: settings.servings,
          })),
        });
      }
    } else {
      // Compléter les trous : upsert uniquement les créneaux nouvellement remplis.
      for (const a of assignments) {
        await tx.plannedMeal.upsert({
          where: {
            householdId_date_mealTime: {
              householdId,
              date: isoToDbDate(a.date),
              mealTime: a.mealTime,
            },
          },
          create: {
            householdId,
            date: isoToDbDate(a.date),
            mealTime: a.mealTime,
            recipeId: a.recipeId,
            servings: settings.servings,
          },
          update: { recipeId: a.recipeId },
        });
      }
    }
  });

  revalidatePath("/calendrier");
  revalidatePath("/courses");
  return { ok: true, count: assignments.length };
}

// --- Batch cooking : marquer des repas comme préparés à l'avance ---

const cellsSchema = z.array(
  z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    mealTime: z.enum(["MIDI", "SOIR"]),
  }),
);

/** Marque des repas comme "préparés à l'avance" (batch cooking). */
export async function markPrepared(input: unknown) {
  const { cells, storage } = z
    .object({ cells: cellsSchema, storage: z.enum(["frigo", "congelo"]).nullable() })
    .parse(input);
  const householdId = await getCurrentHouseholdId();
  if (!cells.length) return { ok: true, count: 0 };
  const res = await prisma.$transaction(
    cells.map((c) =>
      prisma.plannedMeal.updateMany({
        where: { householdId, date: isoToDbDate(c.date), mealTime: c.mealTime },
        // remindedAt remis à zéro pour que le rappel "à réchauffer" puisse partir.
        data: { preparedAt: new Date(), storage: storage ?? null, remindedAt: null },
      }),
    ),
  );
  revalidatePath("/calendrier");
  return { ok: true, count: res.reduce((n, r) => n + r.count, 0) };
}

/** Annule le statut "préparé à l'avance". */
export async function unmarkPrepared(input: unknown) {
  const { cells } = z.object({ cells: cellsSchema }).parse(input);
  const householdId = await getCurrentHouseholdId();
  if (!cells.length) return { ok: true };
  await prisma.$transaction(
    cells.map((c) =>
      prisma.plannedMeal.updateMany({
        where: { householdId, date: isoToDbDate(c.date), mealTime: c.mealTime },
        data: { preparedAt: null, storage: null, remindedAt: null },
      }),
    ),
  );
  revalidatePath("/calendrier");
  return { ok: true };
}
