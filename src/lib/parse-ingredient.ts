import { Unit } from "@/generated/prisma/enums";

export interface ParsedIngredient {
  name: string; // nom lisible (ex: "bœuf haché")
  quantity: number | null;
  unit: Unit | null;
  note: string | null; // précisions ("au goût", "15% MG", "émincé"...)
  raw: string; // ligne d'origine
}

// Tokens d'unité reconnus, testés en début de chaîne (après le nombre).
// Ordonnés du plus long au plus court pour éviter les faux positifs.
const UNIT_PATTERNS: { re: RegExp; unit: Unit }[] = [
  { re: /^(?:cuill(?:è|e)res?\s+à\s+soupe|c\.?\s*à\.?\s*s\.?|cas)\b/i, unit: Unit.CAS },
  { re: /^(?:cuill(?:è|e)res?\s+à\s+caf(?:é|e)|c\.?\s*à\.?\s*c\.?|cac)\b/i, unit: Unit.CAC },
  { re: /^(?:pinc(?:é|e)es?)\b/i, unit: Unit.PINCEE },
  { re: /^kg\b/i, unit: Unit.KG },
  { re: /^cl\b/i, unit: Unit.CL },
  { re: /^ml\b/i, unit: Unit.ML },
  { re: /^g\b/i, unit: Unit.G },
  { re: /^l\b/i, unit: Unit.L },
];

function stripLeadingDe(s: string): string {
  return s.replace(/^(?:d'|d’|de\s+|des\s+|du\s+)/i, "").trim();
}

/**
 * Parse une ligne d'ingrédient en texte libre.
 * Voir PLAN-DEV-CLAUDE-CODE.md §2 : parsing tolérant, jamais 100% fiable,
 * relecture manuelle prévue ensuite via le formulaire recette.
 */
export function parseIngredient(raw: string): ParsedIngredient {
  const original = raw.trim();

  // 1. Extraire une éventuelle parenthèse -> note.
  let note: string | null = null;
  let work = original.replace(/\s*\(([^)]*)\)\s*/, (_m, inner: string) => {
    note = inner.trim();
    return " ";
  });
  work = work.replace(/\s+/g, " ").trim();

  // 2. Repérer un "au goût" / "selon goût" -> note, retiré du nom.
  const gout = work.match(/\b(au\s+go(?:û|u)t|selon\s+go(?:û|u)t|à\s+volont(?:é|e))\b/i);
  if (gout) {
    note = note ? `${note}, ${gout[0]}` : gout[0];
    work = work.replace(gout[0], "").replace(/\s+/g, " ").trim();
  }

  // 3. Nombre en tête ? (accepte "1", "1.2", "1,2")
  const numMatch = work.match(/^(\d+(?:[.,]\d+)?)/);
  if (!numMatch) {
    // Pas de quantité (ex: "Sel, poivre", "Poivre", "Jus de citron vert").
    return {
      name: cleanupName(work) || original,
      quantity: null,
      unit: null,
      note,
      raw: original,
    };
  }

  const quantity = parseFloat(numMatch[1].replace(",", "."));
  let rest = work.slice(numMatch[0].length).trimStart();

  // 4. Unité éventuelle collée ou espacée après le nombre.
  let unit: Unit | null = null;
  for (const { re, unit: u } of UNIT_PATTERNS) {
    const m = rest.match(re);
    if (m) {
      unit = u;
      rest = rest.slice(m[0].length).trimStart();
      break;
    }
  }

  // 5. Retirer "de"/"d'" de liaison, puis nettoyer.
  rest = stripLeadingDe(rest);
  let name = cleanupName(rest);

  // 6. Nombre nu sans unité reconnue -> compte de pièces (ex: "2 oignons").
  if (unit === null && name) {
    unit = Unit.PIECE;
  }

  // Filet de sécurité : si le nom est vide après nettoyage, retomber sur brut.
  if (!name) {
    name = original;
  }

  return { name, quantity, unit, note, raw: original };
}

function cleanupName(s: string): string {
  return s
    .replace(/^[\s,;:-]+/, "")
    .replace(/[\s,;:-]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}
