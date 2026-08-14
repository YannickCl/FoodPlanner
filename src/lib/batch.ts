import { classifyStep, type StepStructure } from "./steps";

export interface PlanStep {
  recipe: string;
  text: string;
  structure: StepStructure;
}

export interface BatchPlan {
  miseEnPlace: PlanStep[]; // gestes actifs sans cuisson (à faire d'abord)
  cuissons: PlanStep[]; // cuissons/attentes, les plus longues d'abord
  activeMin: number; // temps actif cumulé estimé (mise en place)
  longestCookMin: number; // plus longue cuisson (borne basse du temps total)
}

/**
 * Construit un plan de batch cooking à partir des recettes sélectionnées.
 * Déterministe : lit la structure de chaque étape (classifyStep), regroupe la
 * mise en place, puis ordonne les cuissons de la plus longue à la plus courte
 * (on lance les longues d'abord, et on remplit avec les gestes actifs).
 * Les recettes en double (même plat plusieurs fois) ne comptent qu'une fois
 * pour le plan (on cuisine en plus grande quantité).
 */
export function buildBatchPlan(recipes: { recipeName: string; steps: string[] }[]): BatchPlan {
  const seen = new Set<string>();
  const all: PlanStep[] = [];
  for (const r of recipes) {
    if (seen.has(r.recipeName)) continue;
    seen.add(r.recipeName);
    for (const text of r.steps) {
      all.push({ recipe: r.recipeName, text, structure: classifyStep(text) });
    }
  }

  const isPrep = (s: PlanStep) =>
    s.structure.equipment === "aucun" && s.structure.type === "active";

  const miseEnPlace = all.filter(isPrep);
  const cuissons = all
    .filter((s) => !isPrep(s))
    .sort((a, b) => (b.structure.durationMin ?? 0) - (a.structure.durationMin ?? 0));

  const activeMin = miseEnPlace.reduce((n, s) => n + (s.structure.durationMin ?? 0), 0);
  const longestCookMin = cuissons.reduce(
    (m, s) => Math.max(m, s.structure.durationMin ?? 0),
    0,
  );

  return { miseEnPlace, cuissons, activeMin, longestCookMin };
}
