import "server-only";
import { prisma } from "@/lib/db";
import { findDurations } from "@/lib/duration";
import { isoToDbDate } from "@/lib/dates";
import { sendToAll } from "@/lib/push";

const TZ = "Europe/Paris";
const DEFAULT_PREP_MIN = 20; // si la recette n'indique pas de durée
const LATE_GRACE_MIN = 15; // on n'envoie plus un rappel au-delà de l'heure du repas + 15 min
const REHEAT_LEAD_MIN = 15; // plat déjà préparé -> rappel "à réchauffer" 15 min avant

function storageLabel(storage: string | null): string {
  if (storage === "frigo") return " du frigo";
  if (storage === "congelo") return " du congélateur";
  return "";
}

interface ReminderDetail {
  mealTime: "MIDI" | "SOIR";
  recipe: string;
  reminderAt: string; // "HH:MM"
  sent: number;
}

export interface ReminderResult {
  now: string;
  checked: number;
  reminded: number;
  sent: number;
  details: ReminderDetail[];
}

/** Heure locale (Europe/Paris) : date ISO + minutes depuis minuit. */
function parisNow(): { iso: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const iso = `${get("year")}-${get("month")}-${get("day")}`;
  // À minuit, certains environnements renvoient "24" — on ramène à 0.
  const h = parseInt(get("hour"), 10) % 24;
  const minutes = h * 60 + parseInt(get("minute"), 10);
  return { iso, minutes };
}

function parseHHMM(s: string): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(s);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function fmtMin(total: number): string {
  const t = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

/** Minutes de préparation déduites du texte libre prepTime (ex: "30 min", "1h30"). */
function prepMinutes(prepTime: string): number {
  const ds = findDurations(prepTime);
  if (!ds.length) return DEFAULT_PREP_MIN;
  const maxSec = Math.max(...ds.map((d) => d.seconds));
  return Math.max(1, Math.round(maxSec / 60));
}

/**
 * Envoie les rappels "à vos fourneaux" dus maintenant.
 * Idempotent : chaque repas n'est notifié qu'une fois (champ remindedAt).
 */
export async function runReminders(): Promise<ReminderResult> {
  const { iso, minutes: nowMin } = parisNow();

  const result: ReminderResult = {
    now: `${iso} ${fmtMin(nowMin)}`,
    checked: 0,
    reminded: 0,
    sent: 0,
    details: [],
  };

  const dateDb = isoToDbDate(iso);
  // On parcourt chaque foyer avec ses propres réglages (multi-foyers).
  const households = await prisma.household.findMany({ include: { settings: true } });

  for (const h of households) {
    const settings = h.settings;
    if (!settings) continue;

    const meals = [
      { kind: "MIDI" as const, label: "le déjeuner", enabled: settings.lunchEnabled, time: settings.lunchTime },
      { kind: "SOIR" as const, label: "le dîner", enabled: settings.dinnerEnabled, time: settings.dinnerTime },
    ];

    for (const m of meals) {
      if (!m.enabled) continue;
      const mealMin = parseHHMM(m.time);
      if (mealMin == null) continue;

      const rows = await prisma.plannedMeal.findMany({
        where: {
          householdId: h.id,
          date: dateDb,
          mealTime: m.kind,
          remindedAt: null,
          recipeId: { not: null },
        },
        include: { recipe: true },
      });

      for (const row of rows) {
        if (!row.recipe) continue;
        result.checked++;
        const prepared = row.preparedAt !== null;
        // Plat préparé à l'avance -> juste à réchauffer (lead court, texte différent).
        const lead = prepared ? REHEAT_LEAD_MIN : prepMinutes(row.recipe.prepTime);
        const reminderMin = mealMin - lead;

        // On notifie une fois passé l'heure du rappel, tant qu'on n'est pas trop en retard.
        if (nowMin >= reminderMin && nowMin <= mealMin + LATE_GRACE_MIN) {
          const payload = prepared
            ? {
                title: "🥡 À réchauffer !",
                body: `${row.recipe.name} est déjà prêt — sors-le${storageLabel(row.storage)} et réchauffe pour ${m.label} à ${m.time}.`,
                url: `/recettes/${row.recipe.id}`,
                tag: `meal-${row.id}`,
              }
            : {
                title: "🍳 C'est l'heure de cuisiner !",
                body: `${row.recipe.name} — pour ${m.label} à ${m.time}. Prévois ~${lead} min.`,
                url: `/recettes/${row.recipe.id}/cuisiner`,
                tag: `meal-${row.id}`,
              };
          const res = await sendToAll(payload, { householdId: h.id });
          await prisma.plannedMeal.update({
            where: { id: row.id },
            data: { remindedAt: new Date() },
          });
          result.reminded++;
          result.sent += res.sent;
          result.details.push({
            mealTime: m.kind,
            recipe: row.recipe.name,
            reminderAt: fmtMin(reminderMin),
            sent: res.sent,
          });
        }
      }
    }
  }

  return result;
}
