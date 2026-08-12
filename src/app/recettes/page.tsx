import Link from "next/link";
import { getRecipes } from "@/lib/queries";
import { RecipesBrowser } from "./RecipesBrowser";
import { ProposeRecipes } from "./ProposeRecipes";

export const dynamic = "force-dynamic";

export default async function RecettesPage() {
  const recipes = await getRecipes();
  const data = recipes.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    prepTime: r.prepTime,
    containsStarch: r.containsStarch,
    season: r.season,
    ingredientCount: r._count.ingredients,
  }));

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Le carnet de la famille</p>
          <h1 className="text-4xl text-ink">Recettes</h1>
          <p className="mt-1 text-sm text-ink-soft">
            <span className="num">{data.length}</span> recettes à portée de main
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ProposeRecipes />
          <Link
            href="/recettes/nouvelle"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-parchment transition-opacity hover:opacity-90"
          >
            + Nouvelle recette
          </Link>
        </div>
      </div>
      <RecipesBrowser recipes={data} />
    </div>
  );
}
