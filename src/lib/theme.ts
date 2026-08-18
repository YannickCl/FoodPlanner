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
  // On re-valide chaque couleur en hex #RRGGBB avant injection dans le <style>
  // (défense en profondeur contre une éventuelle injection CSS via ces champs).
  const hex = (v?: string | null): string | null =>
    v && /^#[0-9a-fA-F]{6}$/.test(v) ? v : null;

  const lines: string[] = [];
  const bg = hex(t.bgColor);
  const card = hex(t.cardColor);
  const accent = hex(t.accentColor);
  if (bg) {
    lines.push(`--color-parchment:${bg}`);
    lines.push(`--color-parchment-deep:${mix(bg, "#000000", 0.07)}`);
  }
  if (card) lines.push(`--color-parchment-card:${card}`);
  if (accent) {
    lines.push(`--color-gold:${accent}`);
    lines.push(`--color-gold-soft:${mix(accent, "#ffffff", 0.72)}`);
  }
  return lines.length ? `:root{${lines.join(";")}}` : "";
}
