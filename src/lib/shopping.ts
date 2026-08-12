import { Unit, type Aisle } from "@/generated/prisma/enums";
import { aggregationKey, normalizeName } from "./normalize";
import { AISLE_LABELS, AISLE_ORDER } from "./labels";
import { isPantryStaple } from "./staples";

// Ingrédient tel que fourni à l'agrégateur (déjà chargé depuis la base).
export interface RawIngredient {
  name: string;
  quantity: number | null;
  unit: Unit | null;
  note: string | null;
  aisle: Aisle;
}

// Une recette planifiée avec le facteur d'échelle (servings / servingsBase).
export interface PlannedRecipe {
  recipeName: string;
  servings: number;
  servingsBase: number;
  ingredients: RawIngredient[];
}

export interface ShoppingItem {
  key: string; // clé stable = nom regroupé (sert de ShoppingListCheck.ingredientKey)
  name: string; // nom lisible représentatif
  aisle: Aisle;
  qtyLabel: string; // quantité prête à afficher ("400 g", "1.5 kg", "3", "" si inconnue)
  sources: string[]; // recettes d'origine (dédoublonnées)
  notes: string[]; // notes agrégées
}

export interface ShoppingGroup {
  aisle: Aisle;
  label: string;
  items: ShoppingItem[];
}

export interface ShoppingList {
  groups: ShoppingGroup[];
  itemCount: number;
}

// Accumulateur par article : on somme séparément masse (g), volume (ml) et
// décompte (pièces). Les unités "de cuisine" (c. à s./c. à c./pincée) ne sont
// pas des quantités d'achat -> on n'affiche que le nom.
interface Acc {
  key: string;
  name: string;
  aisle: Aisle;
  grams: number;
  ml: number;
  count: number;
  sources: string[];
  notes: string[];
}

function trim(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? r.toString() : r.toString();
}

function formatMass(g: number): string {
  return g >= 1000 ? `${trim(g / 1000)} kg` : `${trim(g)} g`;
}
function formatVol(ml: number): string {
  if (ml >= 1000) return `${trim(ml / 1000)} l`;
  if (ml >= 10) return `${trim(ml / 10)} cl`;
  return `${trim(ml)} ml`;
}

/**
 * Agrège les ingrédients de toutes les recettes planifiées.
 * - regroupement par nom (contenants ignorés : "boîte de", "gousses d'"…) ;
 * - masses (g/kg) et volumes (ml/cl/l) additionnés et affichés proprement ;
 * - unités de cuisine (c. à s., c. à c., pincée) et lignes sans quantité :
 *   on affiche seulement le nom (on n'achète pas "1 c. à s. de farine").
 */
export function aggregateShoppingList(planned: PlannedRecipe[]): ShoppingList {
  const map = new Map<string, Acc>();

  for (const pr of planned) {
    const factor = pr.servingsBase > 0 ? pr.servings / pr.servingsBase : 1;

    for (const ing of pr.ingredients) {
      if (isPantryStaple(ing.name)) continue; // eau, sel, poivre, huile

      const key = aggregationKey(ing.name);
      let acc = map.get(key);
      if (!acc) {
        acc = {
          key,
          name: ing.name,
          aisle: ing.aisle,
          grams: 0,
          ml: 0,
          count: 0,
          sources: [],
          notes: [],
        };
        map.set(key, acc);
      }

      const q = ing.quantity !== null ? ing.quantity * factor : null;
      if (q !== null) {
        switch (ing.unit) {
          case Unit.G:
            acc.grams += q;
            break;
          case Unit.KG:
            acc.grams += q * 1000;
            break;
          case Unit.ML:
            acc.ml += q;
            break;
          case Unit.CL:
            acc.ml += q * 10;
            break;
          case Unit.L:
            acc.ml += q * 1000;
            break;
          case Unit.PIECE:
          case null:
            acc.count += q;
            break;
          // CAS / CAC / PINCEE : mesure de cuisine -> pas une quantité d'achat.
          default:
            break;
        }
      }

      if (ing.note && !acc.notes.includes(ing.note)) acc.notes.push(ing.note);
      // Nom d'affichage : le plus court et lisible.
      if (ing.name.length < acc.name.length) acc.name = ing.name;
      // Rayon : préférer un rayon précis à "AUTRES".
      if (acc.aisle === "AUTRES" && ing.aisle !== "AUTRES") acc.aisle = ing.aisle;
    }
  }

  const groups: ShoppingGroup[] = [];
  let itemCount = 0;
  for (const aisle of AISLE_ORDER) {
    const items = [...map.values()]
      .filter((a) => a.aisle === aisle)
      .sort((a, b) => normalizeName(a.name).localeCompare(normalizeName(b.name)))
      .map((a): ShoppingItem => {
        const parts: string[] = [];
        if (a.count > 0) parts.push(trim(a.count));
        if (a.grams > 0) parts.push(formatMass(a.grams));
        if (a.ml > 0) parts.push(formatVol(a.ml));
        return {
          key: a.key,
          name: a.name,
          aisle: a.aisle,
          qtyLabel: parts.join(" + "),
          sources: a.sources,
          notes: a.notes,
        };
      });
    if (items.length) {
      groups.push({ aisle, label: AISLE_LABELS[aisle], items });
      itemCount += items.length;
    }
  }

  return { groups, itemCount };
}
