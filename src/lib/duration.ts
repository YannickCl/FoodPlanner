// Détection des durées dans le texte d'une étape (ex: "cuire 10 min", "1h30").

export interface StepDuration {
  seconds: number;
  label: string; // texte tel qu'écrit (ex: "10 min", "1h30")
}

/** Extrait les durées mentionnées dans une étape, dans l'ordre d'apparition. */
export function findDurations(text: string): StepDuration[] {
  const found: { index: number; seconds: number; label: string }[] = [];

  // Heures (+ minutes éventuelles) : "1h", "1 h 30", "1h30", "2 heures"
  for (const m of text.matchAll(/(\d+)\s*h(?:eures?)?(?:\s*(\d{1,2}))?/gi)) {
    const h = parseInt(m[1], 10);
    const mn = m[2] ? parseInt(m[2], 10) : 0;
    found.push({ index: m.index ?? 0, seconds: h * 3600 + mn * 60, label: m[0].trim() });
  }
  // Minutes : "10 min", "10 minutes", "10 mn"
  for (const m of text.matchAll(/(\d+)\s*(?:minutes?|min|mn)\b/gi)) {
    found.push({ index: m.index ?? 0, seconds: parseInt(m[1], 10) * 60, label: m[0].trim() });
  }
  // Secondes : "30 sec", "30 secondes"
  for (const m of text.matchAll(/(\d+)\s*(?:secondes?|sec)\b/gi)) {
    found.push({ index: m.index ?? 0, seconds: parseInt(m[1], 10), label: m[0].trim() });
  }

  return found
    .filter((d) => d.seconds > 0)
    .sort((a, b) => a.index - b.index)
    .map(({ seconds, label }) => ({ seconds, label }));
}

/** Formate des secondes en "mm:ss" ou "h:mm:ss". */
export function formatClock(total: number): string {
  const s = Math.max(0, total);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
