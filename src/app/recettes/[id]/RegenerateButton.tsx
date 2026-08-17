"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regenerateRecipe } from "@/app/actions/recipes";
import { CookingQuiz } from "@/components/CookingQuiz";

type Status = "generating" | "done" | "error";

export function RegenerateButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("generating");
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setStatus("generating");
    setError(null);
    setOpen(true);
    const res = await regenerateRecipe(recipeId);
    if (res.ok) setStatus("done");
    else {
      setStatus("error");
      setError(res.error ?? "Erreur");
    }
  }

  function seeRecipe() {
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={start}
        className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment-deep"
      >
        ♻️ Régénérer avec l’IA
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-parchment-card p-6 shadow-xl">
            {status === "generating" && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-gold-soft/50 px-3 py-2 text-sm text-ink">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                L’IA cuisine ta nouvelle recette… joue en attendant !
              </div>
            )}
            {status === "done" && (
              <div className="mb-4 rounded-xl bg-green/15 px-3 py-2 text-sm font-medium text-green">
                ✓ Ta nouvelle recette est prête !
              </div>
            )}
            {status === "error" && (
              <div className="mb-4 rounded-xl bg-brick/10 px-3 py-2 text-sm text-brick">
                {error} — réessaie plus tard.
              </div>
            )}

            <CookingQuiz />

            <div className="mt-5 flex items-center justify-end">
              {status === "done" ? (
                <button
                  onClick={seeRecipe}
                  className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-parchment hover:opacity-90"
                >
                  Voir la nouvelle recette
                </button>
              ) : status === "error" ? (
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:bg-parchment-deep"
                >
                  Fermer
                </button>
              ) : (
                <span className="text-xs text-ink-soft">⏳ Génération en cours…</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
