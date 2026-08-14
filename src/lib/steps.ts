import { findDurations } from "./duration";
import { stripAccents } from "./normalize";

// Structuration déterministe d'une étape de recette (pour le batch cooking).
// On lit le TEXTE de l'étape (écrit par l'IA ou à la main) et on en déduit
// des métadonnées, sans jamais redemander à l'IA.

export type StepType = "active" | "passive";
export type StepEquipment = "four" | "plaque" | "aucun";

export interface StepStructure {
  durationMin: number | null; // durée détectée
  type: StepType; // actif (mains occupées) vs passif (cuisson/attente)
  equipment: StepEquipment; // four | plaque | aucun
}

const RE_OVEN =
  /\b(four|enfourn\w*|gratin\w*|prechauff\w*|thermostat|rotir|rotie?s?)\b|\d{2,3}\s*°/;
const RE_STOVE =
  /\b(poele|poeler|casserole|sauteuse|faitout|marmite|feu|mijot\w*|revenir|saisir|bouill\w*|ebullition|plaque|frire|cuire|cuisson|blanchir|reduire)\b/;
// Étape passive = ça cuit / repose sans intervention.
const RE_PASSIVE =
  /\b(laisser|repos\w*|mijot\w*|enfourn\w*|refroid\w*|marin\w*|lever|infus\w*|reserv\w*|refrig\w*|congel\w*|cuire|cuisson|dorer|gratin\w*)\b/;

function norm(s: string): string {
  return stripAccents(s).toLowerCase();
}

export function classifyStep(text: string): StepStructure {
  const t = norm(text);
  const durations = findDurations(text);
  const seconds = durations.length ? Math.max(...durations.map((d) => d.seconds)) : 0;
  const durationMin = seconds > 0 ? Math.round(seconds / 60) : null;

  const equipment: StepEquipment = RE_OVEN.test(t)
    ? "four"
    : RE_STOVE.test(t)
      ? "plaque"
      : "aucun";

  // Passif seulement si la cuisson/attente porte sur une durée (sinon c'est un
  // geste actif : "couper", "mélanger", "dresser"…).
  const type: StepType = RE_PASSIVE.test(t) && durationMin !== null ? "passive" : "active";

  return { durationMin, type, equipment };
}

export const EQUIPMENT_LABEL: Record<StepEquipment, string> = {
  four: "🔥 Four",
  plaque: "🍳 Plaque",
  aucun: "",
};

export const TYPE_LABEL: Record<StepType, string> = {
  active: "🙌 Actif",
  passive: "⏳ Passif",
};
