import { stripAccents } from "./normalize";

// Ingrédients "de base" présents dans toute maison : on ne les met JAMAIS sur
// la liste de courses (mais ils restent affichés dans la recette).
const STAPLE_NOUNS = new Set(["eau", "sel", "poivre"]);

// Mots de liaison / adjectifs qui n'empêchent pas de reconnaître un basique
// (ex: "poivre noir", "gros sel", "eau tiède", "sel et poivre").
const IGNORE = new Set([
  "de", "d", "du", "des", "et", "ou", "au", "aux", "a", "la", "le", "les",
  "fin", "gros", "grosse", "noir", "noire", "blanc", "blanche", "moulu",
  "moulue", "tiede", "chaud", "chaude", "froid", "froide", "gris", "marin",
]);

/**
 * Vrai si la ligne ne contient que des ingrédients de base (eau, sel, poivre,
 * huile sous toutes ses formes) — à exclure de la liste de courses.
 */
export function isPantryStaple(name: string): boolean {
  const words = stripAccents(name).split(/[^a-z]+/).filter(Boolean);
  if (words.length === 0) return false;

  const singular = (w: string) => w.replace(/[sx]$/, "");
  // Toute huile (olive, tournesol, colza…) est un basique.
  if (words.some((w) => singular(w) === "huile")) return true;

  // On retire les mots de liaison / adjectifs (comparés forme brute ET singulier).
  const content = words.filter(
    (w) => !IGNORE.has(w) && !IGNORE.has(singular(w)),
  );
  return content.length > 0 && content.every((w) => STAPLE_NOUNS.has(singular(w)));
}
