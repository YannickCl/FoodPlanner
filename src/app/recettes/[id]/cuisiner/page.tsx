import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/queries";
import { UNIT_LABELS } from "@/lib/labels";
import { CookMode } from "./CookMode";

export const dynamic = "force-dynamic";

export default async function CookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  // Lignes d'ingrédients prêtes à afficher (référence rapide en cuisine).
  const ingredients = recipe.ingredients.map((ing) => {
    if (ing.isChoice) {
      return `${ing.name} — au choix : ${ing.choiceOptions.join(", ")}`;
    }
    const qty =
      ing.quantity !== null
        ? `${ing.quantity}${ing.unit && UNIT_LABELS[ing.unit] ? ` ${UNIT_LABELS[ing.unit]}` : ""} `
        : "";
    const note = ing.note ? ` (${ing.note})` : "";
    return `${qty}${ing.name}${note}`;
  });

  if (recipe.steps.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="mb-2 font-display text-2xl text-ink">
          Pas d’étapes pour cette recette
        </p>
        <p className="mb-6 text-sm text-ink-soft">
          Ajoute des étapes de préparation pour lancer le mode cuisine.
        </p>
        <Link
          href={`/recettes/${recipe.id}`}
          className="rounded-full border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-parchment"
        >
          ← Retour à la recette
        </Link>
      </div>
    );
  }

  return (
    <CookMode
      recipeId={recipe.id}
      name={recipe.name}
      prepTime={recipe.prepTime}
      steps={recipe.steps}
      ingredients={ingredients}
    />
  );
}
