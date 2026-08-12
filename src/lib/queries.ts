import "server-only";
import { prisma } from "./db";
import { isoToDbDate, dbDateToISO, type ISODate } from "./dates";
import type { Category } from "@/generated/prisma/enums";

export async function getRecipes(opts?: {
  search?: string;
  category?: Category;
}) {
  return prisma.recipe.findMany({
    where: {
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
  return prisma.recipe.findUnique({
    where: { id },
    include: { ingredients: { orderBy: { aisle: "asc" } } },
  });
}

/** Réglages du foyer (crée la ligne unique avec les valeurs par défaut si besoin). */
export async function getSettings() {
  return prisma.settings.upsert({
    where: { id: "household" },
    create: { id: "household" },
    update: {},
  });
}

/** Recettes minimales pour les sélecteurs / le générateur (+ garnitures au choix). */
export async function getRecipesForPicker() {
  const recipes = await prisma.recipe.findMany({
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
  const rows = await prisma.plannedMeal.findMany({
    where: { date: { gte: isoToDbDate(from), lte: isoToDbDate(to) } },
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

/** Données brutes pour la liste de courses sur une période. */
export async function getShoppingData(from: ISODate, to: ISODate) {
  const meals = await prisma.plannedMeal.findMany({
    where: {
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
    where: { rangeStart: isoToDbDate(from), rangeEnd: isoToDbDate(to) },
  });

  return { meals, checks };
}
