import type { Aisle, Unit } from "@/generated/prisma/enums";
import { ingredientKey, normalizeName } from "./normalize";
import { AISLE_LABELS, AISLE_ORDER, UNIT_LABELS } from "./labels";
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
  key: string; // clé stable (nom normalisé + unité) = ShoppingListCheck.ingredientKey
  name: string; // nom lisible représentatif
  aisle: Aisle;
  unit: Unit | null;
  quantity: number | null; // null si "au goût" / non quantifié
  hasQuantity: boolean;
  sources: string[]; // recettes d'origine (dédoublonnées)
  notes: string[]; // notes agrégées (au goût, émincé...)
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

/**
 * Agrège les ingrédients de toutes les recettes planifiées.
 * - même nom normalisé + même unité -> quantités additionnées (après mise à
 *   l'échelle par les portions) ;
 * - unités différentes ou non parseables -> lignes distinctes (§3.3).
 */
export function aggregateShoppingList(planned: PlannedRecipe[]): ShoppingList {
  const map = new Map<string, ShoppingItem>();

  for (const pr of planned) {
    const factor =
      pr.servingsBase > 0 ? pr.servings / pr.servingsBase : 1;

    for (const ing of pr.ingredients) {
      // Ingrédients de base (eau, sel, poivre, huile) : jamais sur la liste.
      if (isPantryStaple(ing.name)) continue;

      const key = ingredientKey(ing.name, ing.unit);
      let item = map.get(key);
      if (!item) {
        item = {
          key,
          name: ing.name,
          aisle: ing.aisle,
          unit: ing.unit,
          quantity: null,
          hasQuantity: false,
          sources: [],
          notes: [],
        };
        map.set(key, item);
      }

      if (ing.quantity !== null) {
        const scaled = ing.quantity * factor;
        item.quantity = (item.quantity ?? 0) + scaled;
        item.hasQuantity = true;
      }
      if (!item.sources.includes(pr.recipeName)) {
        item.sources.push(pr.recipeName);
      }
      if (ing.note && !item.notes.includes(ing.note)) {
        item.notes.push(ing.note);
      }
      // Préférer un nom d'affichage court et stable.
      if (ing.name.length < item.name.length) item.name = ing.name;
    }
  }

  // Arrondi propre des quantités.
  for (const item of map.values()) {
    if (item.quantity !== null) {
      item.quantity = Math.round(item.quantity * 100) / 100;
    }
  }

  // Regroupement par rayon, dans l'ordre magasin.
  const groups: ShoppingGroup[] = [];
  let itemCount = 0;
  for (const aisle of AISLE_ORDER) {
    const items = [...map.values()]
      .filter((i) => i.aisle === aisle)
      .sort((a, b) => normalizeName(a.name).localeCompare(normalizeName(b.name)));
    if (items.length) {
      groups.push({ aisle, label: AISLE_LABELS[aisle], items });
      itemCount += items.length;
    }
  }

  return { groups, itemCount };
}

/**
 * Formatage d'une quantité pour la liste de courses : "400 g", "1.5 kg",
 * "2 oignon". Sans quantité connue, on n'affiche rien (juste le nom suffit
 * pour savoir qu'il faut en acheter).
 */
export function formatQuantity(item: {
  quantity: number | null;
  unit: Unit | null;
  hasQuantity: boolean;
}): string {
  if (!item.hasQuantity || item.quantity === null) return "";
  const q = item.quantity;
  const num = Number.isInteger(q) ? q.toString() : q.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  const unitLabel = item.unit ? UNIT_LABELS[item.unit] : "";
  return unitLabel ? `${num} ${unitLabel}` : num;
}
