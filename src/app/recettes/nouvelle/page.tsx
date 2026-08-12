import Link from "next/link";
import { createRecipe } from "@/app/actions/recipes";
import { RecipeForm } from "../RecipeForm";

export default function NouvelleRecettePage() {
  return (
    <div>
      <div className="mb-4">
        <Link href="/recettes" className="text-sm text-ink-soft hover:text-ink">
          ← Toutes les recettes
        </Link>
      </div>
      <h1 className="mb-6 text-3xl text-ink">Nouvelle recette</h1>
      <RecipeForm action={createRecipe} submitLabel="Créer la recette" />
    </div>
  );
}
