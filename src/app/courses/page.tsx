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

  const { meals, checks } = await getShoppingData(from, to);

  const planned: PlannedRecipe[] = meals
    .filter((m) => m.recipe)
    .map((m) => {
      const choices = (m.choices ?? {}) as Record<string, string>;
      const ingredients: RawIngredient[] = [];
      for (const i of m.recipe!.ingredients) {
        if (i.isChoice) {
          // Garniture au choix : n'ajouter que l'option retenue pour ce repas.
          const chosen = choices[i.id];
          if (chosen) {
            ingredients.push({
              name: chosen,
              quantity: null,
              unit: null,
              note: null,
              aisle: guessAisle(chosen),
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

  return (
    <ShoppingClient
      from={from}
      to={to}
      today={todayISO}
      list={list}
      checkedKeys={checkedKeys}
      recipeCount={planned.length}
    />
  );
}
