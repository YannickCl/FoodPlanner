import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/queries";
import { updateRecipe } from "@/app/actions/recipes";
import { RecipeForm, type RecipeFormInitial } from "../../RecipeForm";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  const initial: RecipeFormInitial = {
    name: recipe.name,
    category: recipe.category,
    prepTime: recipe.prepTime,
    containsStarch: recipe.containsStarch,
    starchFamily: recipe.starchFamily,
    season: recipe.season,
    mealTime: recipe.mealTime,
    dayType: recipe.dayType,
    minGapDays: recipe.minGapDays,
    servingsBase: recipe.servingsBase,
    steps: recipe.steps,
    ingredients: recipe.ingredients.map((i) => ({
      name: i.name,
      quantity: i.quantity !== null ? String(i.quantity) : "",
      unit: i.unit ?? "",
      note: i.note ?? "",
      aisle: i.aisle,
      isChoice: i.isChoice,
      options: i.choiceOptions.join(", "),
    })),
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          href={`/recettes/${id}`}
          className="text-sm text-ink-soft hover:text-ink"
        >
          ← Retour à la recette
        </Link>
      </div>
      <h1 className="mb-6 text-3xl text-ink">Modifier la recette</h1>
      <RecipeForm
        initial={initial}
        action={updateRecipe.bind(null, id)}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
