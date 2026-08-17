"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/actions/recipes";
import { cn } from "@/lib/cn";

export function FavoriteToggle({
  recipeId,
  initial,
}: {
  recipeId: string;
  initial: boolean;
}) {
  const router = useRouter();
  const [fav, setFav] = useState(initial);
  const [pending, start] = useTransition();

  function toggle() {
    const v = !fav;
    setFav(v); // optimiste
    start(async () => {
      await toggleFavorite(recipeId, v);
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        fav
          ? "border-gold bg-gold-soft text-ink"
          : "border-line text-ink hover:bg-parchment-deep",
      )}
    >
      {fav ? "★ Favori" : "☆ Favori"}
    </button>
  );
}
