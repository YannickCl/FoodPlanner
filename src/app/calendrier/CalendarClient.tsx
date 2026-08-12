"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Category } from "@/generated/prisma/enums";
import { WEEKDAY_LABELS, formatLong, shiftMonth, buildMonthGrid } from "@/lib/dates";
import { setMeal, generatePlanning } from "@/app/actions/planning";
import {
  RecipePickerModal,
  type PickerRecipe,
} from "@/components/RecipePickerModal";
import { cn } from "@/lib/cn";

export interface MealCell {
  recipeId: string;
  name: string;
  category: Category;
  containsStarch: boolean;
  servings: number;
}
export type MealMap = Record<string, MealCell>;

interface Week {
  iso: string;
  inMonth: boolean;
  isToday: boolean;
}

const CATEGORY_ACCENT: Record<Category, string> = {
  FAVORI: "border-l-gold",
  RAPIDE: "border-l-green",
  HEALTHY: "border-l-green",
  SALADE_ETE: "border-l-green",
  SOUPE_HIVER: "border-l-brick",
};

// Limite de navigation : ±6 mois autour du mois courant réel.
function monthsFromNow(year: number, month0: number): number {
  const now = new Date();
  return (year - now.getFullYear()) * 12 + (month0 - now.getMonth());
}

export function CalendarClient({
  year,
  month0,
  monthLabel,
  weeks,
  firstISO,
  lastISO,
  todayISO,
  mealMap,
  recipes,
  defaultServings,
}: {
  year: number;
  month0: number;
  monthLabel: string;
  weeks: Week[][];
  firstISO: string;
  lastISO: string;
  todayISO: string;
  mealMap: MealMap;
  recipes: PickerRecipe[];
  defaultServings: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [picker, setPicker] = useState<{
    date: string;
    mealTime: "MIDI" | "SOIR";
  } | null>(null);
  const [genOpen, setGenOpen] = useState(false);
  const [garnish, setGarnish] = useState<{
    date: string;
    mealTime: "MIDI" | "SOIR";
    recipe: PickerRecipe;
  } | null>(null);

  const offset = monthsFromNow(year, month0);
  const canPrev = offset > -6;
  const canNext = offset < 6;

  function go(delta: number) {
    const { year: y, month0: m } = shiftMonth(year, month0, delta);
    router.push(`/calendrier?y=${y}&m=${m}`);
  }

  function commitMeal(
    ctx: { date: string; mealTime: "MIDI" | "SOIR" },
    recipeId: string | null,
    choices?: Record<string, string>,
  ) {
    startTransition(async () => {
      await setMeal({
        date: ctx.date,
        mealTime: ctx.mealTime,
        recipeId,
        servings: defaultServings,
        choices,
      });
      router.refresh();
    });
  }

  function pick(recipeId: string | null) {
    if (!picker) return;
    const ctx = picker;
    // Recette avec garnitures au choix -> demander la garniture avant d'enregistrer.
    if (recipeId) {
      const r = recipes.find((x) => x.id === recipeId);
      if (r && r.choiceGroups.length > 0) {
        setPicker(null);
        setGarnish({ date: ctx.date, mealTime: ctx.mealTime, recipe: r });
        return;
      }
    }
    setPicker(null);
    commitMeal(ctx, recipeId);
  }

  function runGenerate(scope: "month" | "sixmonths", mode: "fill" | "replace") {
    const from = firstISO;
    const to =
      scope === "month"
        ? lastISO
        : (() => {
            const { year: y, month0: m } = shiftMonth(year, month0, 5);
            return buildMonthGrid(y, m, todayISO).lastISO;
          })();
    setGenOpen(false);
    startTransition(async () => {
      await generatePlanning({ from, to, mode });
      router.refresh();
    });
  }

  const current = picker ? mealMap[`${picker.date}#${picker.mealTime}`] : null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            disabled={!canPrev || pending}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink disabled:opacity-30"
          >
            ←
          </button>
          <h1 className="min-w-[180px] text-center text-2xl text-ink">
            {monthLabel}
          </h1>
          <button
            onClick={() => go(1)}
            disabled={!canNext || pending}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink disabled:opacity-30"
          >
            →
          </button>
          {offset !== 0 && (
            <button
              onClick={() => router.push("/calendrier")}
              className="ml-1 text-sm text-ink-soft hover:text-ink"
            >
              Aujourd’hui
            </button>
          )}
        </div>
        <button
          onClick={() => setGenOpen(true)}
          disabled={pending}
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "…" : "✨ Générer le planning"}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="pb-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-soft"
          >
            {d}
          </div>
        ))}
        {weeks.flat().map((day) => (
          <div
            key={day.iso}
            className={cn(
              "min-h-[104px] rounded-lg border p-1.5",
              day.inMonth
                ? "border-line bg-parchment-card"
                : "border-line/40 bg-parchment-card/40",
              day.isToday && "ring-2 ring-gold",
            )}
          >
            <div
              className={cn(
                "num mb-1 px-0.5 text-xs",
                day.inMonth ? "text-ink-soft" : "text-ink-soft/40",
                day.isToday && "font-bold text-gold",
              )}
            >
              {parseInt(day.iso.slice(-2), 10)}
            </div>
            <div className="space-y-1">
              <Slot
                day={day}
                mealTime="MIDI"
                cell={mealMap[`${day.iso}#MIDI`]}
                onClick={() => setPicker({ date: day.iso, mealTime: "MIDI" })}
              />
              <Slot
                day={day}
                mealTime="SOIR"
                cell={mealMap[`${day.iso}#SOIR`]}
                onClick={() => setPicker({ date: day.iso, mealTime: "SOIR" })}
              />
            </div>
          </div>
        ))}
      </div>

      {picker && (
        <RecipePickerModal
          title={picker.mealTime === "MIDI" ? "Déjeuner" : "Dîner"}
          subtitle={formatLong(picker.date)}
          recipes={recipes}
          slotMealTime={picker.mealTime}
          onPick={pick}
          onClose={() => setPicker(null)}
          onClear={current ? () => pick(null) : undefined}
        />
      )}

      {genOpen && (
        <GenerateModal
          monthLabel={monthLabel}
          onClose={() => setGenOpen(false)}
          onRun={runGenerate}
        />
      )}

      {garnish && (
        <GarnishModal
          recipe={garnish.recipe}
          subtitle={formatLong(garnish.date)}
          onCancel={() => setGarnish(null)}
          onConfirm={(choices) => {
            const ctx = { date: garnish.date, mealTime: garnish.mealTime };
            setGarnish(null);
            commitMeal(ctx, garnish.recipe.id, choices);
          }}
        />
      )}
    </div>
  );
}

function GarnishModal({
  recipe,
  subtitle,
  onConfirm,
  onCancel,
}: {
  recipe: PickerRecipe;
  subtitle: string;
  onConfirm: (choices: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(
      recipe.choiceGroups.map((g) => [g.id, g.choiceOptions[0] ?? ""]),
    ),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-parchment-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-ink">Choisir la garniture</h2>
        <p className="mt-0.5 text-sm text-ink-soft">
          {recipe.name} · {subtitle}
        </p>

        <div className="mt-4 space-y-4">
          {recipe.choiceGroups.map((g) => (
            <div key={g.id}>
              <p className="mb-2 text-sm font-medium text-ink">{g.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.choiceOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setSelected((s) => ({ ...s, [g.id]: opt }))
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      selected[g.id] === opt
                        ? "border-gold bg-gold-soft/50 text-ink"
                        : "border-line text-ink-soft hover:text-ink",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-parchment hover:opacity-90"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

function Slot({
  day,
  mealTime,
  cell,
  onClick,
}: {
  day: Week;
  mealTime: "MIDI" | "SOIR";
  cell?: MealCell;
  onClick: () => void;
}) {
  if (cell) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "block w-full rounded border-l-[3px] bg-parchment px-1.5 py-1 text-left text-[11px] leading-tight text-ink hover:bg-parchment-deep",
          CATEGORY_ACCENT[cell.category],
        )}
        title={cell.name}
      >
        <span className="block text-[9px] uppercase tracking-wide text-ink-soft">
          {mealTime === "MIDI" ? "Midi" : "Soir"}
        </span>
        <span className="line-clamp-2">{cell.name}</span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full rounded border border-dashed border-line px-1.5 py-1 text-left text-[10px] text-ink-soft/70 hover:border-ink/40 hover:text-ink",
        !day.inMonth && "opacity-50",
      )}
    >
      <span className="text-[9px] uppercase tracking-wide">
        {mealTime === "MIDI" ? "Midi" : "Soir"}
      </span>
      <span className="block">+ choisir</span>
    </button>
  );
}

function GenerateModal({
  monthLabel,
  onClose,
  onRun,
}: {
  monthLabel: string;
  onClose: () => void;
  onRun: (scope: "month" | "sixmonths", mode: "fill" | "replace") => void;
}) {
  const [scope, setScope] = useState<"month" | "sixmonths">("month");
  const [mode, setMode] = useState<"fill" | "replace">("fill");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-parchment-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-ink">Générer le planning</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Remplit les repas selon les règles (pas de féculent le soir,
          rotation, saison…).
        </p>

        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-medium text-ink">Période</legend>
          <div className="space-y-2">
            <Radio
              checked={scope === "month"}
              onChange={() => setScope("month")}
              title={`Ce mois-ci (${monthLabel})`}
            />
            <Radio
              checked={scope === "sixmonths"}
              onChange={() => setScope("sixmonths")}
              title="Les 6 prochains mois"
            />
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-medium text-ink">Méthode</legend>
          <div className="space-y-2">
            <Radio
              checked={mode === "fill"}
              onChange={() => setMode("fill")}
              title="Compléter les trous seulement"
              hint="Conserve les repas déjà choisis."
            />
            <Radio
              checked={mode === "replace"}
              onChange={() => setMode("replace")}
              title="Tout régénérer"
              hint="Efface et recrée toute la période."
            />
          </div>
        </fieldset>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Annuler
          </button>
          <button
            onClick={() => onRun(scope, mode)}
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-parchment hover:opacity-90"
          >
            Générer
          </button>
        </div>
      </div>
    </div>
  );
}

function Radio({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  hint?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition-colors",
        checked ? "border-gold bg-gold-soft/40" : "border-line hover:bg-parchment",
      )}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 accent-gold"
      />
      <span>
        <span className="block text-sm text-ink">{title}</span>
        {hint && <span className="block text-xs text-ink-soft">{hint}</span>}
      </span>
    </label>
  );
}
