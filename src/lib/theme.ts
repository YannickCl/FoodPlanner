// Thème personnalisable : construit les surcharges de variables CSS à partir
// des couleurs choisies dans les réglages (fond, cartes, accent).

export interface ThemeColors {
  bgColor?: string | null;
  cardColor?: string | null;
  accentColor?: string | null;
}

function clampHex(h: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h : "#000000";
}

/** Mélange deux couleurs hex (amt = part de `target`, 0..1). */
function mix(hex: string, target: string, amt: number): string {
  const a = clampHex(hex);
  const b = clampHex(target);
  const ai = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const bi = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const out = ai.map((v, i) => Math.round(v * (1 - amt) + bi[i] * amt));
  return "#" + out.map((v) => v.toString(16).padStart(2, "0")).join("");
}

/** CSS à injecter (chaîne vide si aucune couleur personnalisée). */
export function buildThemeCss(t: ThemeColors): string {
  const lines: string[] = [];
  if (t.bgColor) {
    lines.push(`--color-parchment:${t.bgColor}`);
    lines.push(`--color-parchment-deep:${mix(t.bgColor, "#000000", 0.07)}`);
  }
  if (t.cardColor) lines.push(`--color-parchment-card:${t.cardColor}`);
  if (t.accentColor) {
    lines.push(`--color-gold:${t.accentColor}`);
    lines.push(`--color-gold-soft:${mix(t.accentColor, "#ffffff", 0.72)}`);
  }
  return lines.length ? `:root{${lines.join(";")}}` : "";
}
