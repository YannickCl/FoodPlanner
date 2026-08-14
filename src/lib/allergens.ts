import { stripAccents } from "./normalize";

// Détection déterministe des allergènes : on compare les ingrédients d'une
// recette aux allergènes déclarés par le foyer, via une table d'alias.
// (Volontairement prudent : mieux vaut sur-signaler que rater un allergène.)
const ALIAS_GROUPS: string[][] = [
  ["arachide", "cacahuete", "cacahouete", "peanut"],
  ["fruits a coque", "noix", "noisette", "amande", "cajou", "pistache", "pecan"],
  ["lait", "lactose", "creme", "beurre", "fromage", "yaourt", "parmesan"],
  ["oeuf", "oeufs"],
  ["gluten", "ble", "farine", "seigle", "orge", "chapelure", "pates", "pain"],
  ["soja", "soya", "tofu"],
  ["poisson", "cabillaud", "saumon", "thon", "colin", "merlu", "anchois"],
  ["crustaces", "crevette", "crabe", "homard", "langoustine", "gambas"],
  ["fruits de mer", "moule", "huitre", "coquillage", "saint-jacques"],
  ["sesame"],
  ["moutarde"],
  ["celeri"],
  ["sulfites"],
];

function norm(s: string): string {
  return stripAccents(s).toLowerCase().trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Terme présent comme mot entier (évite "blé" dans "blette").
function hasWord(haystack: string, term: string): boolean {
  return new RegExp(`\\b${escapeRegExp(term)}\\b`).test(haystack);
}

/** Allergènes déclarés effectivement détectés dans la liste d'ingrédients. */
export function detectAllergens(
  ingredientNames: string[],
  declared: string[],
): string[] {
  const ings = ingredientNames.map(norm);
  const hits: string[] = [];
  for (const d of declared) {
    const dn = norm(d);
    if (!dn) continue;
    const group = ALIAS_GROUPS.find((g) =>
      g.some((t) => t === dn || dn.includes(t) || t.includes(dn)),
    );
    const terms = group ? Array.from(new Set([...group, dn])) : [dn];
    if (ings.some((ing) => terms.some((t) => hasWord(ing, t)))) hits.push(d);
  }
  return hits;
}
