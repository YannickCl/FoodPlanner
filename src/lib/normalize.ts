import type { Unit } from "@/generated/prisma/enums";

// Normalisation des noms d'ingrédients pour l'agrégation de la liste de courses.
// Objectif : "Oignons", "oignon", "OIGNON" -> même clé "oignon".

/** minuscule + suppression des accents + espaces compactés */
export function stripAccents(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Singularisation simple du dernier mot (français) : retire un "s" ou "x"
 * final. Suffisant pour dédoublonner "oignons"/"oignon", "tomates"/"tomate".
 * On évite de toucher aux mots de 3 lettres ou moins ("riz", "ail").
 */
function singularizeWord(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith("x")) return word.slice(0, -1);
  if (word.endsWith("s")) return word.slice(0, -1);
  return word;
}

/** Nom normalisé et singularisé, utilisé comme base de la clé d'agrégation. */
export function normalizeName(name: string): string {
  const cleaned = stripAccents(name);
  return cleaned
    .split(" ")
    .map((w) => singularizeWord(w))
    .join(" ")
    .trim();
}

/**
 * Clé stable d'agrégation : nom normalisé + unité. Deux ingrédients ne
 * s'additionnent que s'ils partagent nom ET unité. Une unité nulle
 * (non parseable / "au goût") produit une clé distincte "sans unité".
 */
export function ingredientKey(name: string, unit: Unit | null | undefined): string {
  return `${normalizeName(name)}::${unit ?? "NONE"}`;
}
