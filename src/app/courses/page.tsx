import { getShoppingData } from "@/lib/queries";
import { toISO, weekRange } from "@/lib/dates";
import {
  aggregateShoppingList,
  type PlannedRecipe,
  type RawIngredient,
} from "@/lib/shopping";
import { guessAisle } from "@/lib/aisle";
import { ShoppingClient } from "./ShoppingClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const todayISO = toISO(new Date());
  const defaults = weekRange(todayISO);
  const from = sp.from ?? defaults.from;
  const to = sp.to ?? defaults.to;

  const { meals, checks, extras } = await getShoppingData(from, to);

  const planned: PlannedRecipe[] = meals
    .filter((m) => m.recipe)
    .map((m) => {
      const choices = (m.choices ?? {}) as Record<string, string | string[]>;
      const ingredients: RawIngredient[] = [];
      for (const i of m.recipe!.ingredients) {
        if (i.isChoice) {
          // Garniture(s) au choix : ajouter chaque option retenue pour ce repas.
          const raw = choices[i.id];
          const chosen = Array.isArray(raw) ? raw : raw ? [raw] : [];
          for (const opt of chosen) {
            ingredients.push({
              name: opt,
              quantity: null,
              unit: null,
              note: null,
              aisle: guessAisle(opt),
            });
          }
          continue;
        }
        ingredients.push({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          note: i.note,
          aisle: i.aisle,
        });
      }
      return {
        recipeName: m.recipe!.name,
        servings: m.servings,
        servingsBase: m.recipe!.servingsBase,
        ingredients,
      };
    });

  const list = aggregateShoppingList(planned);
  const checkedKeys = checks.filter((c) => c.checked).map((c) => c.ingredientKey);

  // Détail par recette : les ingrédients regroupés sous chaque plat.
  const byName = new Map<string, PlannedRecipe[]>();
  for (const p of planned) {
    const arr = byName.get(p.recipeName) ?? [];
    arr.push(p);
    byName.set(p.recipeName, arr);
  }
  const recipeBreakdown = [...byName.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, prs]) => ({
      name,
      items: aggregateShoppingList(prs)
        .groups.flatMap((g) => g.items)
        .map((it) => ({ name: it.name, qtyLabel: it.qtyLabel })),
    }));

  return (
    <ShoppingClient
      from={from}
      to={to}
      today={todayISO}
      list={list}
      checkedKeys={checkedKeys}
      recipeCount={planned.length}
      recipeBreakdown={recipeBreakdown}
      extras={extras.map((e) => ({ id: e.id, name: e.name, checked: e.checked }))}
    />
  );
}
