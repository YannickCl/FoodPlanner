import "server-only";
import { prisma } from "./db";

export const FREE_RECIPE_LIMIT = 30;

export interface RecipeQuota {
  premium: boolean;
  count: number;
  limit: number; // Infinity si premium
  remaining: number; // Infinity si premium
  canAdd: boolean;
}

export async function getRecipeQuota(householdId: string): Promise<RecipeQuota> {
  const [household, count] = await Promise.all([
    prisma.household.findUnique({ where: { id: householdId }, select: { plan: true } }),
    prisma.recipe.count({ where: { householdId } }),
  ]);
  const premium = household?.plan === "PREMIUM";
  return {
    premium,
    count,
    limit: premium ? Infinity : FREE_RECIPE_LIMIT,
    remaining: premium ? Infinity : Math.max(0, FREE_RECIPE_LIMIT - count),
    canAdd: premium || count < FREE_RECIPE_LIMIT,
  };
}

/** Lève une erreur si le foyer (offre gratuite) a atteint la limite de recettes. */
export async function assertCanAddRecipe(householdId: string): Promise<void> {
  const q = await getRecipeQuota(householdId);
  if (!q.canAdd) {
    throw new Error(
      `Limite de ${FREE_RECIPE_LIMIT} recettes atteinte (offre gratuite). Passe en premium pour un carnet illimité.`,
    );
  }
}
