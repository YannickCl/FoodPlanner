"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { recipeSchema } from "@/lib/validation";
import { getSettings } from "@/lib/queries";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { generateRecipeFromName, proposeRecipes, type AIRecipe } from "@/lib/ai";
import { guessAisle } from "@/lib/aisle";

export interface ActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parse(input: unknown) {
  const res = recipeSchema.safeParse(input);
  if (!res.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of res.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }
  return { data: res.data };
}

export async function createRecipe(input: unknown): Promise<ActionResult> {
  const { data, fieldErrors } = parse(input);
  if (!data) return { ok: false, fieldErrors };

  const householdId = await getCurrentHouseholdId();
  const recipe = await prisma.recipe.create({
    data: {
      householdId,
      name: data.name,
      category: data.category,
      prepTime: data.prepTime,
      containsStarch: data.containsStarch,
      starchFamily: data.containsStarch ? data.starchFamily : null,
      season: data.season,
      mealTime: data.mealTime,
      dayType: data.dayType,
      minGapDays: data.minGapDays,
      servingsBase: data.servingsBase,
      steps: data.steps,
      ingredients: {
        create: data.ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          note: i.note,
          aisle: i.aisle,
          isChoice: i.isChoice,
          choiceOptions: i.choiceOptions,
        })),
      },
    },
  });

  revalidatePath("/recettes");
  redirect(`/recettes/${recipe.id}`);
}

export async function updateRecipe(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const { data, fieldErrors } = parse(input);
  if (!data) return { ok: false, fieldErrors };

  // Vérifie que la recette appartient bien au foyer courant.
  const householdId = await getCurrentHouseholdId();
  const owned = await prisma.recipe.findFirst({
    where: { id, householdId },
    select: { id: true },
  });
  if (!owned) return { ok: false, error: "Recette introuvable." };

  await prisma.$transaction([
    prisma.ingredient.deleteMany({ where: { recipeId: id } }),
    prisma.recipe.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        prepTime: data.prepTime,
        containsStarch: data.containsStarch,
        starchFamily: data.containsStarch ? data.starchFamily : null,
        season: data.season,
        mealTime: data.mealTime,
        dayType: data.dayType,
        minGapDays: data.minGapDays,
        servingsBase: data.servingsBase,
        steps: data.steps,
        ingredients: {
          create: data.ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            note: i.note,
            aisle: i.aisle,
            isChoice: i.isChoice,
            choiceOptions: i.choiceOptions,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/recettes");
  revalidatePath(`/recettes/${id}`);
  redirect(`/recettes/${id}`);
}

export async function deleteRecipe(id: string): Promise<ActionResult> {
  // PlannedMeal.recipeId passe à null (onDelete: SetNull) — pas de plantage.
  // deleteMany scopé au foyer : impossible de supprimer la recette d'un autre foyer.
  const householdId = await getCurrentHouseholdId();
  await prisma.recipe.deleteMany({ where: { id, householdId } });
  revalidatePath("/recettes");
  revalidatePath("/calendrier");
  redirect("/recettes");
}

// ---------------------------------------------------------------------------
// Fonctions IA (Claude)
// ---------------------------------------------------------------------------

export type AIRecipeWithAisle = Omit<AIRecipe, "ingredients"> & {
  ingredients: (AIRecipe["ingredients"][number] & { aisle: string })[];
};

function withAisles(r: AIRecipe): AIRecipeWithAisle {
  return {
    ...r,
    ingredients: r.ingredients.map((i) => ({ ...i, aisle: guessAisle(i.name) })),
  };
}

/** Génère une recette via l'IA à partir de son nom (pour pré-remplir le formulaire). */
export async function generateRecipeAI(
  name: string,
): Promise<{ ok: boolean; recipe?: AIRecipeWithAisle; error?: string }> {
  if (!name.trim()) return { ok: false, error: "Donne d'abord un nom de recette." };
  try {
    const settings = await getSettings();
    const r = await generateRecipeFromName(name.trim(), {
      allergies: settings.allergies,
      forbidden: settings.forbidden,
    });
    return { ok: true, recipe: withAisles(r) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Échec IA" };
  }
}

/** Propose plusieurs recettes via l'IA (pour l'écran "Propose-moi..."). */
export async function proposeRecipesAI(
  count = 5,
): Promise<{ ok: boolean; recipes?: AIRecipeWithAisle[]; error?: string }> {
  try {
    const householdId = await getCurrentHouseholdId();
    const settings = await getSettings();
    const existing = await prisma.recipe.findMany({
      where: { householdId },
      select: { name: true },
    });
    const recipes = await proposeRecipes({
      count,
      allergies: settings.allergies,
      forbidden: settings.forbidden,
      existingNames: existing.map((e) => e.name),
    });
    return { ok: true, recipes: recipes.map(withAisles) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Échec IA" };
  }
}

/** Enregistre en base une liste de recettes proposées par l'IA. */
export async function addRecipesAI(recipes: AIRecipeWithAisle[]) {
  const householdId = await getCurrentHouseholdId();
  const settings = await getSettings();
  for (const r of recipes) {
    await prisma.recipe.create({
      data: {
        householdId,
        name: r.name,
        category: r.category,
        prepTime: r.prepTime,
        containsStarch: r.containsStarch,
        starchFamily: r.containsStarch ? r.starchFamily : null,
        season: r.season,
        mealTime: r.mealTime,
        dayType: r.dayType,
        minGapDays: r.minGapDays,
        servingsBase: settings.servings,
        steps: r.steps,
        ingredients: {
          create: r.ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            note: i.note,
            aisle: guessAisle(i.name),
          })),
        },
      },
    });
  }
  revalidatePath("/recettes");
  return { ok: true, count: recipes.length };
}
