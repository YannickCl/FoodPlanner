import "server-only";
import { prisma } from "./db";
import { isoToDbDate, dbDateToISO, type ISODate } from "./dates";
import { getCurrentHouseholdId } from "./tenant";
import type { Category } from "@/generated/prisma/enums";

export async function getRecipes(opts?: {
  search?: string;
  category?: Category;
}) {
  const householdId = await getCurrentHouseholdId();
  return prisma.recipe.findMany({
    where: {
      householdId,
      ...(opts?.category ? { category: opts.category } : {}),
      ...(opts?.search
        ? { name: { contains: opts.search, mode: "insensitive" } }
        : {}),
    },
    orderBy: { name: "asc" },
    include: { _count: { select: { ingredients: true } } },
  });
}

export async function getRecipe(id: string) {
  const householdId = await getCurrentHouseholdId();
  return prisma.recipe.findFirst({
    where: { id, householdId },
    include: { ingredients: { orderBy: { aisle: "asc" } } },
  });
}

/** Réglages du foyer courant (crée la ligne avec les valeurs par défaut si besoin). */
export async function getSettings() {
  const householdId = await getCurrentHouseholdId();
  return prisma.settings.upsert({
    where: { householdId },
    create: { householdId },
    update: {},
  });
}

/** Recettes minimales pour les sélecteurs / le générateur (+ garnitures au choix). */
export async function getRecipesForPicker() {
  const householdId = await getCurrentHouseholdId();
  const recipes = await prisma.recipe.findMany({
    where: { householdId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      containsStarch: true,
      starchFamily: true,
      season: true,
      mealTime: true,
      dayType: true,
      minGapDays: true,
      prepTime: true,
      servingsBase: true,
      ingredients: {
        where: { isChoice: true },
        select: { id: true, name: true, choiceOptions: true },
      },
    },
  });
  return recipes.map((r) => {
    const { ingredients, ...rest } = r;
    return { ...rest, choiceGroups: ingredients };
  });
}

export interface PlannedMealDTO {
  id: string;
  date: ISODate;
  mealTime: "MIDI" | "SOIR";
  servings: number;
  recipe: { id: string; name: string; category: Category; containsStarch: boolean } | null;
}

export async function getPlannedMeals(
  from: ISODate,
  to: ISODate,
): Promise<PlannedMealDTO[]> {
  const householdId = await getCurrentHouseholdId();
  const rows = await prisma.plannedMeal.findMany({
    where: { householdId, date: { gte: isoToDbDate(from), lte: isoToDbDate(to) } },
    include: {
      recipe: {
        select: { id: true, name: true, category: true, containsStarch: true },
      },
    },
    orderBy: [{ date: "asc" }, { mealTime: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    date: dbDateToISO(r.date),
    mealTime: r.mealTime as "MIDI" | "SOIR",
    servings: r.servings,
    recipe: r.recipe,
  }));
}

/** Repas sélectionnés (par date + midi/soir) pour une session de batch cooking. */
export async function getBatchMeals(
  cells: { date: ISODate; mealTime: "MIDI" | "SOIR" }[],
) {
  const householdId = await getCurrentHouseholdId();
  if (!cells.length) return [];
  const rows = await prisma.plannedMeal.findMany({
    where: {
      householdId,
      recipeId: { not: null },
      OR: cells.map((c) => ({ date: isoToDbDate(c.date), mealTime: c.mealTime })),
    },
    include: { recipe: { include: { ingredients: true } } },
  });
  return rows
    .filter((r) => r.recipe)
    .map((r) => ({
      recipeName: r.recipe!.name,
      servings: r.servings,
      servingsBase: r.recipe!.servingsBase,
      steps: r.recipe!.steps,
      choices: (r.choices ?? {}) as Record<string, string | string[]>,
      ingredients: r.recipe!.ingredients,
    }));
}

/** Données brutes pour la liste de courses sur une période. */
export async function getShoppingData(from: ISODate, to: ISODate) {
  const householdId = await getCurrentHouseholdId();
  const meals = await prisma.plannedMeal.findMany({
    where: {
      householdId,
      date: { gte: isoToDbDate(from), lte: isoToDbDate(to) },
      recipeId: { not: null },
    },
    include: {
      recipe: {
        include: { ingredients: true },
      },
    },
  });

  const checks = await prisma.shoppingListCheck.findMany({
    where: { householdId, rangeStart: isoToDbDate(from), rangeEnd: isoToDbDate(to) },
  });

  const extras = await prisma.shoppingExtra.findMany({
    where: { householdId, rangeStart: isoToDbDate(from), rangeEnd: isoToDbDate(to) },
    orderBy: { createdAt: "asc" },
  });

  return { meals, checks, extras };
}
