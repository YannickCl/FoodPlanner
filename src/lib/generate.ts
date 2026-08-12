import { differenceInCalendarDays, getMonth, getDay, parseISO } from "date-fns";
import {
  MealTime,
  Season,
  DayType,
  type StarchFamily,
} from "@/generated/prisma/enums";

// Sous-ensemble de Recipe nécessaire à l'algorithme (découplé de Prisma pour
// rester testable).
export interface GenRecipe {
  id: string;
  name: string;
  containsStarch: boolean;
  starchFamily: StarchFamily | null;
  season: Season;
  mealTime: MealTime;
  dayType: DayType;
  minGapDays: number;
}

export interface Slot {
  date: string; // "YYYY-MM-DD"
  mealTime: "MIDI" | "SOIR";
}

export interface ExistingMeal {
  date: string;
  mealTime: "MIDI" | "SOIR";
  recipeId: string | null;
}

export type GenerateMode = "fill" | "replace";

export interface GenerateInput {
  slots: Slot[]; // créneaux de la période, ordonnés chronologiquement
  recipes: GenRecipe[];
  existing: ExistingMeal[]; // repas déjà planifiés (dans ET autour de la période)
  mode: GenerateMode; // "fill" = compléter les trous ; "replace" = tout régénérer
  rng?: () => number; // injectable pour les tests
}

export interface Assignment {
  date: string;
  mealTime: "MIDI" | "SOIR";
  recipeId: string;
}

// Plafond du "retard" pour éviter qu'une recette jamais utilisée n'écrase
// toutes les autres au tirage pondéré.
const RETARD_CAP = 90;
const NEVER_USED_DAYS = 100000;

/** La saison de la recette autorise-t-elle ce mois (1-12) ? */
export function seasonAllows(season: Season, month1to12: number): boolean {
  switch (season) {
    case Season.ALL:
      return true;
    case Season.ETE:
      return month1to12 === 8 || month1to12 === 9; // août-septembre
    case Season.HIVER:
      return month1to12 === 11 || month1to12 === 12 || month1to12 === 1;
    case Season.HIVER_PREF:
      // Plats mijotés : tout sauf le plein été (juin-août).
      return !(month1to12 >= 6 && month1to12 <= 8);
    default:
      return true;
  }
}

function isWeekend(dateISO: string): boolean {
  const d = getDay(parseISO(dateISO)); // 0 = dimanche, 6 = samedi
  return d === 0 || d === 6;
}

function dayTypeAllows(dayType: DayType, dateISO: string): boolean {
  if (dayType === DayType.BOTH) return true;
  return isWeekend(dateISO)
    ? dayType === DayType.WEEKEND
    : dayType === DayType.SEMAINE;
}

function mealTimeAllows(recipeMeal: MealTime, slot: "MIDI" | "SOIR"): boolean {
  if (recipeMeal === MealTime.BOTH) return true;
  return recipeMeal === slot;
}

/** Tirage aléatoire pondéré par les poids fournis. */
function weightedPick<T>(
  items: T[],
  weights: number[],
  rng: () => number,
): T | null {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return null;
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * Génère les affectations de recettes sur les créneaux fournis.
 * Contraintes (PLAN-DEV-CLAUDE-CODE.md §3.2, §8) :
 *  - dîner (SOIR) : jamais de féculent ;
 *  - pas deux fois la même famille de féculent sur deux jours consécutifs
 *    (midi et soir confondus), ni deux fois le même jour ;
 *  - respect de minGapDays (tirage pondéré par le carré du retard) ;
 *  - saisonnalité selon le mois.
 * En cas d'impasse, les contraintes souples (gap, adjacence de famille,
 * dayType) sont relâchées progressivement ; season/mealTime/starch restent dures.
 */
export function generatePlan(input: GenerateInput): Assignment[] {
  const rng = input.rng ?? Math.random;
  const { recipes, slots, existing, mode } = input;

  // Dernière date d'utilisation connue par recette (repas hors ET dans période).
  const lastUsed = new Map<string, string>();
  const existingByKey = new Map<string, string | null>();
  for (const m of existing) {
    existingByKey.set(`${m.date}#${m.mealTime}`, m.recipeId);
    if (m.recipeId) {
      const prev = lastUsed.get(m.recipeId);
      if (!prev || m.date > prev) lastUsed.set(m.recipeId, m.date);
    }
  }

  const assignments: Assignment[] = [];

  // Familles de féculent utilisées la veille et le jour courant.
  let prevDayFamilies = new Set<StarchFamily>();
  let todayFamilies = new Set<StarchFamily>();
  let currentDay: string | null = null;

  const recordFamily = (r: GenRecipe) => {
    if (r.starchFamily) todayFamilies.add(r.starchFamily);
  };

  for (const slot of slots) {
    // Changement de jour : la veille devient les familles du jour écoulé.
    if (currentDay !== slot.date) {
      if (currentDay !== null) prevDayFamilies = todayFamilies;
      todayFamilies = new Set();
      currentDay = slot.date;
    }

    const key = `${slot.date}#${slot.mealTime}`;
    const existingRecipeId = existingByKey.get(key) ?? null;

    // Mode "fill" : on conserve un créneau déjà rempli.
    if (mode === "fill" && existingRecipeId) {
      const r = recipes.find((x) => x.id === existingRecipeId);
      if (r) recordFamily(r);
      // lastUsed déjà positionné via existing.
      continue;
    }

    const month = getMonth(parseISO(slot.date)) + 1; // getMonth: 0-11

    // Filtres durs.
    const hardOk = (r: GenRecipe): boolean => {
      if (!mealTimeAllows(r.mealTime, slot.mealTime)) return false;
      if (slot.mealTime === "SOIR" && r.containsStarch) return false;
      if (!seasonAllows(r.season, month)) return false;
      return true;
    };

    // Filtres souples, relâchés par niveaux successifs.
    const familyOk = (r: GenRecipe): boolean =>
      !r.starchFamily ||
      (!prevDayFamilies.has(r.starchFamily) &&
        !todayFamilies.has(r.starchFamily));

    const dayOk = (r: GenRecipe): boolean => dayTypeAllows(r.dayType, slot.date);

    const gapDays = (r: GenRecipe): number => {
      const last = lastUsed.get(r.id);
      return last
        ? differenceInCalendarDays(parseISO(slot.date), parseISO(last))
        : NEVER_USED_DAYS;
    };
    const gapOk = (r: GenRecipe): boolean => gapDays(r) >= r.minGapDays;

    // Niveaux de relâchement : chaque niveau ajoute une contrainte satisfaite.
    const levels: ((r: GenRecipe) => boolean)[][] = [
      [hardOk, familyOk, dayOk, gapOk], // idéal
      [hardOk, familyOk, gapOk], // on lâche dayType
      [hardOk, familyOk, dayOk], // on lâche le gap
      [hardOk, familyOk], // on lâche gap + dayType
      [hardOk, dayOk], // on lâche l'adjacence de famille
      [hardOk], // dernier recours : contraintes dures seules
    ];

    let picked: GenRecipe | null = null;
    for (const preds of levels) {
      const candidates = recipes.filter((r) => preds.every((p) => p(r)));
      if (candidates.length === 0) continue;
      const weights = candidates.map((r) => {
        const retard = Math.min(gapDays(r) - r.minGapDays, RETARD_CAP);
        // retard peut être négatif si le gap a été relâché -> poids plancher.
        const eff = Math.max(retard, 0) + 1;
        return eff * eff; // pondération par le carré du retard
      });
      picked = weightedPick(candidates, weights, rng);
      if (picked) break;
    }

    if (!picked) continue; // aucun candidat même en dernier recours -> vide

    assignments.push({
      date: slot.date,
      mealTime: slot.mealTime,
      recipeId: picked.id,
    });
    lastUsed.set(picked.id, slot.date);
    recordFamily(picked);
  }

  return assignments;
}
