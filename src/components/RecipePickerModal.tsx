"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, MealTime, StarchFamily, Season } from "@/generated/prisma/enums";
import { CATEGORY_LABELS } from "@/lib/labels";
import { stripAccents } from "@/lib/normalize";
import { CategoryBadge, StarchBadge } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface ChoiceGroup {
  id: string;
  name: string;
  choiceOptions: string[];
}

export interface PickerRecipe {
  id: string;
  name: string;
  category: Category;
  containsStarch: boolean;
  starchFamily: StarchFamily | null;
  season: Season;
  mealTime: MealTime;
  prepTime: string;
  servingsBase: number;
  choiceGroups: ChoiceGroup[];
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function RecipePickerModal({
  title,
  subtitle,
  recipes,
  slotMealTime,
  onPick,
  onClose,
  onClear,
}: {
  title: string;
  subtitle?: string;
  recipes: PickerRecipe[];
  slotMealTime?: "MIDI" | "SOIR";
  onPick: (id: string) => void;
  onClose: () => void;
  onClear?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = stripAccents(search);
    return recipes
      .filter((r) => (cat ? r.category === cat : true))
      .filter((r) => (q ? stripAccents(r.name).includes(q) : true))
      .sort((a, b) => {
        // Suggère les recettes compatibles avec le créneau en premier.
        const score = (r: PickerRecipe) => {
          if (!slotMealTime) return 0;
          if (slotMealTime === "SOIR" && r.containsStarch) return 2;
          if (r.mealTime !== "BOTH" && r.mealTime !== slotMealTime) return 1;
          return 0;
        };
        return score(a) - score(b) || a.name.localeCompare(b.name);
      });
  }, [recipes, search, cat, slotMealTime]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-parchment-card shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl text-ink">{title}</h2>
              {subtitle && (
                <p className="text-sm text-ink-soft">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-ink-soft hover:bg-parchment hover:text-ink"
            >
              ✕
            </button>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            placeholder="Rechercher…"
            className="mt-3 w-full rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            <MiniChip active={cat === null} onClick={() => setCat(null)}>
              Toutes
            </MiniChip>
            {CATEGORIES.map((c) => (
              <MiniChip key={c} active={cat === c} onClick={() => setCat(c)}>
                {CATEGORY_LABELS[c]}
              </MiniChip>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {filtered.map((r) => {
            const warn = slotMealTime === "SOIR" && r.containsStarch;
            return (
              <button
                key={r.id}
                onClick={() => onPick(r.id)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-left hover:border-line hover:bg-parchment"
              >
                <div className="min-w-0">
                  <p className="truncate text-ink">{r.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <CategoryBadge category={r.category} />
                    <StarchBadge contains={r.containsStarch} />
                    {warn && (
                      <span className="text-xs text-brick">
                        féculent le soir
                      </span>
                    )}
                  </div>
                </div>
                <span className="num shrink-0 text-xs text-ink-soft">
                  {r.prepTime}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-soft">
              Aucune recette.
            </p>
          )}
        </div>

        {onClear && (
          <div className="border-t border-line p-3">
            <button
              onClick={onClear}
              className="w-full rounded-lg border border-brick/40 px-3 py-2 text-sm font-medium text-brick hover:bg-brick/10"
            >
              Vider ce créneau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniChip({
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
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-ink bg-ink text-parchment"
          : "border-line text-ink-soft hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
