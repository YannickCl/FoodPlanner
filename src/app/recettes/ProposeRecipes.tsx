"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  proposeRecipesAI,
  addRecipesAI,
  type AIRecipeWithAisle,
} from "@/app/actions/recipes";
import { CATEGORY_LABELS } from "@/lib/labels";
import type { Category } from "@/generated/prisma/enums";
import { CookingQuiz } from "@/components/CookingQuiz";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

type Phase = "idle" | "picking" | "generating" | "proposals";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function ProposeRecipes() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [type, setType] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<AIRecipeWithAisle[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  async function generate() {
    setError(null);
    setPhase("generating");
    const res = await proposeRecipesAI(5, type ?? undefined);
    if (res.ok && res.recipes) {
      setProposals(res.recipes);
      setChecked(new Set(res.recipes.map((_, i) => i)));
      setPhase("proposals");
    } else {
      setError(res.error ?? "Échec de la suggestion");
      setPhase("picking");
    }
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
    setSaving(true);
    void (async () => {
      await addRecipesAI(selected);
      setSaving(false);
      setPhase("idle");
      setProposals([]);
      router.refresh();
    })();
  }

  return (
    <>
      <button
        onClick={() => {
          setType(null);
          setError(null);
          setPhase("picking");
        }}
        className="rounded-full border border-gold bg-gold-soft/40 px-4 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
      >
        ✨ Propose-moi 5 recettes
      </button>

      {/* Choix du type */}
      {phase === "picking" && (
        <Modal onClose={() => setPhase("idle")}>
          <h2 className="mb-1 text-xl text-ink">Quel type de recettes ?</h2>
          <p className="mb-4 text-sm text-ink-soft">
            L’IA te proposera 5 recettes de ce type.
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            <TypeChip active={type === null} onClick={() => setType(null)}>
              Peu importe
            </TypeChip>
            {CATEGORIES.map((c) => (
              <TypeChip key={c} active={type === c} onClick={() => setType(c)}>
                {CATEGORY_LABELS[c]}
              </TypeChip>
            ))}
          </div>
          {error && <p className="mb-3 text-sm text-brick">{error}</p>}
          <button
            onClick={generate}
            className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-parchment hover:opacity-90"
          >
            ✨ Générer 5 recettes
          </button>
        </Modal>
      )}

      {/* Génération + quiz */}
      {phase === "generating" && (
        <Modal>
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-gold-soft/50 px-3 py-2 text-sm text-ink">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            L’IA mijote 5 recettes… joue en attendant !
          </div>
          <CookingQuiz />
          <p className="mt-4 text-center text-xs text-ink-soft">⏳ Génération en cours…</p>
        </Modal>
      )}

      {/* Sélection des propositions */}
      {phase === "proposals" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setPhase("idle")}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-parchment-card shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-line p-4">
              <div>
                <h2 className="text-xl text-ink">Suggestions de l’IA</h2>
                <p className="text-sm text-ink-soft">Coche celles à ajouter à ton carnet.</p>
              </div>
              <button
                onClick={() => setPhase("idle")}
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
                        <span className="num">{r.ingredients.length}</span> ingrédients
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                        {r.ingredients.slice(0, 6).map((ing) => ing.name).join(", ")}…
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

function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-parchment-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function TypeChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-ink bg-ink text-parchment"
          : "border-line bg-parchment text-ink-soft hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
