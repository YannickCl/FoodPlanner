import {
  getPlannedMeals,
  getRecipesForPicker,
  getSettings,
} from "@/lib/queries";
import { buildMonthGrid, toISO } from "@/lib/dates";
import { CalendarClient, type MealMap } from "./CalendarClient";

export const dynamic = "force-dynamic";

export default async function CalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const todayISO = toISO(now);
  const year = sp.y ? parseInt(sp.y, 10) : now.getFullYear();
  const month0 = sp.m ? parseInt(sp.m, 10) : now.getMonth();

  const grid = buildMonthGrid(year, month0, todayISO);
  const gridStart = grid.weeks[0][0].iso;
  const gridEnd = grid.weeks[grid.weeks.length - 1][6].iso;

  const [meals, recipes, settings] = await Promise.all([
    getPlannedMeals(gridStart, gridEnd),
    getRecipesForPicker(),
    getSettings(),
  ]);

  const mealMap: MealMap = {};
  for (const m of meals) {
    if (!m.recipe) continue;
    mealMap[`${m.date}#${m.mealTime}`] = {
      recipeId: m.recipe.id,
      name: m.recipe.name,
      category: m.recipe.category,
      containsStarch: m.recipe.containsStarch,
      servings: m.servings,
    };
  }

  return (
    <CalendarClient
      year={year}
      month0={month0}
      monthLabel={grid.monthLabel}
      weeks={grid.weeks}
      firstISO={grid.firstISO}
      lastISO={grid.lastISO}
      todayISO={todayISO}
      mealMap={mealMap}
      recipes={recipes}
      defaultServings={settings.servings}
    />
  );
}
