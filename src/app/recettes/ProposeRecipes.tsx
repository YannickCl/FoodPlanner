"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  proposeRecipesAI,
  addRecipesAI,
  type AIRecipeWithAisle,
} from "@/app/actions/recipes";
import { CATEGORY_LABELS } from "@/lib/labels";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

export function ProposeRecipes() {
  const router = useRouter();
  const [loading, startLoad] = useTransition();
  const [saving, startSave] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<AIRecipeWithAisle[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function propose() {
    setError(null);
    startLoad(async () => {
      const res = await proposeRecipesAI(5);
      if (res.ok && res.recipes) {
        setProposals(res.recipes);
        setChecked(new Set(res.recipes.map((_, i) => i)));
        setOpen(true);
      } else {
        setError(res.error ?? "Échec de la suggestion");
      }
    });
  }

  function toggle(i: number) {
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function addSelection() {
    const selected = proposals.filter((_, i) => checked.has(i));
    if (!selected.length) return;
    startSave(async () => {
      await addRecipesAI(selected);
      setOpen(false);
      setProposals([]);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={propose}
        disabled={loading}
        className="rounded-full border border-gold bg-gold-soft/40 px-4 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "L'IA réfléchit…" : "✨ Propose-moi 5 recettes"}
      </button>
      {error && <p className="mt-1 text-xs text-brick">{error}</p>}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-parchment-card shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-line p-4">
              <div>
                <h2 className="text-xl text-ink">Suggestions de l'IA</h2>
                <p className="text-sm text-ink-soft">
                  Coche celles à ajouter à ton carnet.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-ink-soft hover:bg-parchment hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {proposals.map((r, i) => (
                <Card key={i} className="p-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked.has(i)}
                      onChange={() => toggle(i)}
                      className="mt-1 h-4 w-4 shrink-0 accent-green"
                    />
                    <div className="min-w-0">
                      <p className="text-ink">{r.name}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {CATEGORY_LABELS[r.category]} · {r.prepTime} ·{" "}
                        <span className="num">{r.ingredients.length}</span>{" "}
                        ingrédients
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                        {r.ingredients
                          .slice(0, 6)
                          .map((ing) => ing.name)
                          .join(", ")}
                        …
                      </p>
                    </div>
                  </label>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-line p-3">
              <span className="text-sm text-ink-soft">
                <span className="num">{checked.size}</span> sélectionnée(s)
              </span>
              <button
                onClick={addSelection}
                disabled={saving || checked.size === 0}
                className={cn(
                  "rounded-full bg-ink px-5 py-2 text-sm font-medium text-parchment transition-opacity hover:opacity-90",
                  (saving || checked.size === 0) && "opacity-60",
                )}
              >
                {saving ? "Ajout…" : "Ajouter la sélection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
