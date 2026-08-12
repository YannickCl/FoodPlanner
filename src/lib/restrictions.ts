import { stripAccents } from "./normalize";

/**
 * Vrai si l'un des ingrédients correspond à un terme interdit (allergie /
 * aliment interdit). Comparaison sur nom normalisé (sans accents, minuscules),
 * par inclusion de mot.
 */
export function hasRestrictedIngredient(
  ingredientNames: string[],
  terms: string[],
): boolean {
  const cleanedTerms = terms.map((t) => stripAccents(t)).filter((t) => t.length >= 2);
  if (!cleanedTerms.length) return false;
  return ingredientNames.some((name) => {
    const n = stripAccents(name);
    return cleanedTerms.some((t) => n.includes(t));
  });
}
