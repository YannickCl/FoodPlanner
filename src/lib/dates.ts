import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";

export type ISODate = string; // "YYYY-MM-DD"

/** Date JS -> "YYYY-MM-DD" (composantes locales, pas d'UTC). */
export function toISO(d: Date): ISODate {
  return format(d, "yyyy-MM-dd");
}

/** "YYYY-MM-DD" -> Date locale à minuit (pour l'affichage/calcul calendrier). */
export function fromISO(iso: ISODate): Date {
  return parseISO(iso);
}

/**
 * "YYYY-MM-DD" -> Date à minuit UTC, pour les colonnes Postgres `@db.Date`.
 * Évite les décalages de fuseau lors de l'écriture.
 */
export function isoToDbDate(iso: ISODate): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Colonne `@db.Date` -> "YYYY-MM-DD" (lecture en UTC). */
export function dbDateToISO(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}

/** Toutes les dates ISO entre from et to (bornes incluses). */
export function rangeISO(from: ISODate, to: ISODate): ISODate[] {
  const days = eachDayOfInterval({ start: fromISO(from), end: fromISO(to) });
  return days.map(toISO);
}

export interface MonthGrid {
  monthLabel: string; // "Août 2026"
  weeks: { iso: ISODate; inMonth: boolean; isToday: boolean }[][];
  firstISO: ISODate; // premier jour du mois
  lastISO: ISODate; // dernier jour du mois
}

/**
 * Grille mensuelle façon calendrier (semaines lundi->dimanche), avec les jours
 * débordants des mois adjacents marqués `inMonth: false`.
 */
export function buildMonthGrid(year: number, month0: number, todayISO: ISODate): MonthGrid {
  const first = startOfMonth(new Date(year, month0, 1));
  const last = endOfMonth(first);
  const gridStart = startOfWeek(first, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(last, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weeks: MonthGrid["weeks"] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(
      days.slice(i, i + 7).map((d) => {
        const iso = toISO(d);
        return {
          iso,
          inMonth: d.getMonth() === month0,
          isToday: iso === todayISO,
        };
      }),
    );
  }

  return {
    monthLabel: capitalize(format(first, "LLLL yyyy", { locale: fr })),
    weeks,
    firstISO: toISO(first),
    lastISO: toISO(last),
  };
}

export function shiftMonth(year: number, month0: number, delta: number) {
  const d = addMonths(new Date(year, month0, 1), delta);
  return { year: d.getFullYear(), month0: d.getMonth() };
}

/** Semaine (lundi->dimanche) contenant la date donnée. */
export function weekRange(iso: ISODate): { from: ISODate; to: ISODate } {
  const d = fromISO(iso);
  return {
    from: toISO(startOfWeek(d, { weekStartsOn: 1 })),
    to: toISO(endOfWeek(d, { weekStartsOn: 1 })),
  };
}

/** Mois contenant la date donnée (1er -> dernier jour). */
export function monthRangeOf(iso: ISODate): { from: ISODate; to: ISODate } {
  const d = fromISO(iso);
  return { from: toISO(startOfMonth(d)), to: toISO(endOfMonth(d)) };
}

export function formatLong(iso: ISODate): string {
  return capitalize(format(fromISO(iso), "EEEE d MMMM yyyy", { locale: fr }));
}

export function formatShortDay(iso: ISODate): string {
  return capitalize(format(fromISO(iso), "EEE d", { locale: fr }));
}

export { addDays };

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
