"use server";

import { revalidatePath } from "next/cache";
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
import { hasRestrictedIngredient } from "@/lib/restrictions";

/** Upsert (ou effacement) d'un repas sur un créneau. */
export async function setMeal(input: unknown) {
  const data = setMealSchema.parse(input);
  const date = isoToDbDate(data.date);
  const choices = data.choices ?? undefined;

  if (data.recipeId === null) {
    await prisma.plannedMeal.deleteMany({
      where: { date, mealTime: data.mealTime },
    });
  } else {
    await prisma.plannedMeal.upsert({
      where: { date_mealTime: { date, mealTime: data.mealTime } },
      create: {
        date,
        mealTime: data.mealTime,
        recipeId: data.recipeId,
        servings: data.servings,
        choices,
      },
      update: { recipeId: data.recipeId, servings: data.servings, choices },
    });
  }

  revalidatePath("/calendrier");
  revalidatePath("/courses");
  return { ok: true };
}

/** Génère le planning sur une période (mode "fill" ou "replace"). */
export async function generatePlanning(input: unknown) {
  const { from, to, mode } = generateSchema.parse(input);

  const settings = await getSettings();
  const restrictions = [...settings.allergies, ...settings.forbidden];

  const allRecipes = await prisma.recipe.findMany({
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
    .map(({ ingredients: _ing, ...rest }) => rest);

  // Contexte : repas des 90 jours précédant la période, pour respecter les gaps.
  const preStart = toISO(addDays(fromISO(from), -90));
  const preEnd = toISO(addDays(fromISO(from), -1));

  const contextRows = await prisma.plannedMeal.findMany({
    where: {
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
      where: { date: { gte: isoToDbDate(from), lte: isoToDbDate(to) } },
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
      // Tout régénérer : on efface la période puis on réécrit.
      await tx.plannedMeal.deleteMany({
        where: { date: { gte: isoToDbDate(from), lte: isoToDbDate(to) } },
      });
      if (assignments.length) {
        await tx.plannedMeal.createMany({
          data: assignments.map((a) => ({
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
            date_mealTime: { date: isoToDbDate(a.date), mealTime: a.mealTime },
          },
          create: {
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
