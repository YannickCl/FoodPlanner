import {
  Aisle,
  Category,
  DayType,
  MealTime,
  Season,
  StarchFamily,
  Unit,
} from "@/generated/prisma/enums";

// Libellés français pour l'affichage. Les clés sont les valeurs d'enum Prisma.

export const CATEGORY_LABELS: Record<Category, string> = {
  FAVORI: "Favori",
  RAPIDE: "Rapide",
  HEALTHY: "Healthy",
  SALADE_ETE: "Salade d'été",
  SOUPE_HIVER: "Soupe d'hiver",
};

export const MEALTIME_LABELS: Record<MealTime, string> = {
  MIDI: "Déjeuner",
  SOIR: "Dîner",
  BOTH: "Midi & soir",
};

export const DAYTYPE_LABELS: Record<DayType, string> = {
  SEMAINE: "Semaine",
  WEEKEND: "Week-end",
  BOTH: "Tous les jours",
};

export const SEASON_LABELS: Record<Season, string> = {
  ALL: "Toute l'année",
  ETE: "Été",
  HIVER: "Hiver",
  HIVER_PREF: "Plutôt l'hiver",
};

export const STARCH_FAMILY_LABELS: Record<StarchFamily, string> = {
  PATES: "Pâtes",
  RIZ: "Riz",
  PDT: "Pommes de terre",
  PAIN: "Pain",
  PIZZA: "Pizza",
  TORTILLA: "Tortilla",
  SEMOULE: "Semoule",
  QUINOA: "Quinoa",
  GALETTE: "Galette",
  PATE_BRISEE: "Pâte brisée",
};

export const UNIT_LABELS: Record<Unit, string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  CL: "cl",
  L: "l",
  PIECE: "", // "pièce" -> affiché sans unité (ex: "2 oignons")
  CAS: "c. à s.",
  CAC: "c. à c.",
  PINCEE: "pincée",
};

export const AISLE_LABELS: Record<Aisle, string> = {
  BOUCHERIE: "Boucherie",
  POISSONNERIE: "Poissonnerie",
  CREMERIE: "Crèmerie",
  FRUITS_LEGUMES: "Fruits & légumes",
  EPICERIE: "Épicerie",
  AUTRES: "Autres",
};

// Ordre d'affichage des rayons sur la liste de courses (ordre logique en magasin).
export const AISLE_ORDER: Aisle[] = [
  Aisle.FRUITS_LEGUMES,
  Aisle.BOUCHERIE,
  Aisle.POISSONNERIE,
  Aisle.CREMERIE,
  Aisle.EPICERIE,
  Aisle.AUTRES,
];

// Helpers pour construire des listes d'options (selects, chips).
export function enumOptions<T extends Record<string, string>>(
  labels: T,
): { value: keyof T; label: string }[] {
  return (Object.keys(labels) as (keyof T)[]).map((value) => ({
    value,
    label: labels[value],
  }));
}
