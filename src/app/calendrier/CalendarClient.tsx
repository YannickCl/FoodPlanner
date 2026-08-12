"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Category } from "@/generated/prisma/enums";
import {
  WEEKDAY_LABELS,
  formatLong,
  shiftMonth,
  buildMonthGrid,
  addDays,
  fromISO,
  toISO,
} from "@/lib/dates";
import { setMeal, generatePlanning, clearMeals } from "@/app/actions/planning";
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
  const [slotAction, setSlotAction] = useState<{
    date: string;
    mealTime: "MIDI" | "SOIR";
    cell: MealCell;
  } | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    choices?: Record<string, string[]>,
    servings?: number,
  ) {
    startTransition(async () => {
      await setMeal({
        date: ctx.date,
        mealTime: ctx.mealTime,
        recipeId,
        servings: servings ?? defaultServings,
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

  // Clic sur un créneau : en mode sélection on (dé)sélectionne les repas remplis ;
  // sinon un créneau rempli ouvre le menu d'actions, un créneau vide ouvre le choix.
  function onSlotClick(
    iso: string,
    mealTime: "MIDI" | "SOIR",
    cell: MealCell | undefined,
  ) {
    const key = `${iso}#${mealTime}`;
    if (selecting) {
      if (!cell) return; // rien à retirer sur un créneau vide
      setSelected((s) => {
        const next = new Set(s);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
      return;
    }
    if (cell) setSlotAction({ date: iso, mealTime, cell });
    else setPicker({ date: iso, mealTime });
  }

  function selectAllMonth() {
    const next = new Set<string>();
    for (const day of weeks.flat()) {
      if (!day.inMonth) continue;
      for (const mt of ["MIDI", "SOIR"] as const) {
        if (mealMap[`${day.iso}#${mt}`]) next.add(`${day.iso}#${mt}`);
      }
    }
    setSelected(next);
  }

  function removeSelected() {
    const cells = [...selected].map((k) => {
      const [date, mealTime] = k.split("#");
      return { date, mealTime: mealTime as "MIDI" | "SOIR" };
    });
    if (!cells.length) return;
    setSelecting(false);
    setSelected(new Set());
    startTransition(async () => {
      await clearMeals(cells);
      router.refresh();
    });
  }

  function exitSelect() {
    setSelecting(false);
    setSelected(new Set());
  }

  function runGenerate(
    scope: "month" | "sixmonths" | "custom",
    mode: "fill" | "replace",
    untilDate?: string,
  ) {
    let from = firstISO;
    let to = lastISO;
    if (scope === "sixmonths") {
      const { year: y, month0: m } = shiftMonth(year, month0, 5);
      to = buildMonthGrid(y, m, todayISO).lastISO;
    } else if (scope === "custom") {
      // D'aujourd'hui jusqu'à la date choisie.
      from = todayISO;
      to = untilDate && untilDate >= todayISO ? untilDate : todayISO;
    }
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
        {selecting ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-soft">
              <span className="num">{selected.size}</span> sélectionné(s)
            </span>
            <button
              onClick={selectAllMonth}
              className="rounded-full border border-line px-3 py-2 text-sm text-ink hover:bg-parchment-deep"
            >
              Tout le mois
            </button>
            <button
              onClick={removeSelected}
              disabled={pending || selected.size === 0}
              className="rounded-full bg-brick px-4 py-2 text-sm font-semibold text-parchment transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "…" : `Retirer (${selected.size})`}
            </button>
            <button
              onClick={exitSelect}
              className="rounded-full border border-line px-3 py-2 text-sm text-ink-soft hover:text-ink"
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelecting(true)}
              disabled={pending}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-parchment-deep disabled:opacity-60"
            >
              Modifier la sélection
            </button>
            <button
              onClick={() => setGenOpen(true)}
              disabled={pending}
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "…" : "✨ Générer le planning"}
            </button>
          </div>
        )}
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
                selecting={selecting}
                isSelected={selected.has(`${day.iso}#MIDI`)}
                onClick={() =>
                  onSlotClick(day.iso, "MIDI", mealMap[`${day.iso}#MIDI`])
                }
              />
              <Slot
                day={day}
                mealTime="SOIR"
                cell={mealMap[`${day.iso}#SOIR`]}
                selecting={selecting}
                isSelected={selected.has(`${day.iso}#SOIR`)}
                onClick={() =>
                  onSlotClick(day.iso, "SOIR", mealMap[`${day.iso}#SOIR`])
                }
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

      {slotAction && (
        <SlotActionModal
          cellName={slotAction.cell.name}
          subtitle={`${slotAction.mealTime === "MIDI" ? "Déjeuner" : "Dîner"} · ${formatLong(slotAction.date)}`}
          onView={() => {
            const id = slotAction.cell.recipeId;
            setSlotAction(null);
            router.push(`/recettes/${id}`);
          }}
          onReplace={() => {
            const ctx = { date: slotAction.date, mealTime: slotAction.mealTime };
            setSlotAction(null);
            setPicker(ctx);
          }}
          onRemove={() => {
            const ctx = { date: slotAction.date, mealTime: slotAction.mealTime };
            setSlotAction(null);
            commitMeal(ctx, null);
          }}
          onClose={() => setSlotAction(null)}
        />
      )}

      {genOpen && (
        <GenerateModal
          monthLabel={monthLabel}
          todayISO={todayISO}
          onClose={() => setGenOpen(false)}
          onRun={runGenerate}
        />
      )}

      {garnish && (
        <GarnishModal
          recipe={garnish.recipe}
          subtitle={formatLong(garnish.date)}
          defaultServings={defaultServings}
          onCancel={() => setGarnish(null)}
          onConfirm={(choices, servings) => {
            const ctx = { date: garnish.date, mealTime: garnish.mealTime };
            setGarnish(null);
            commitMeal(ctx, garnish.recipe.id, choices, servings);
          }}
        />
      )}
    </div>
  );
}

function SlotActionModal({
  cellName,
  subtitle,
  onView,
  onReplace,
  onRemove,
  onClose,
}: {
  cellName: string;
  subtitle: string;
  onView: () => void;
  onReplace: () => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-line bg-parchment-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-ink">{cellName}</h2>
        <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>
        <div className="mt-4 space-y-2">
          <button
            onClick={onView}
            className="w-full rounded-lg border border-line px-4 py-2.5 text-left text-sm font-medium text-ink hover:bg-parchment"
          >
            👁 Voir la recette
          </button>
          <button
            onClick={onReplace}
            className="w-full rounded-lg border border-line px-4 py-2.5 text-left text-sm font-medium text-ink hover:bg-parchment"
          >
            ↔ Remplacer la recette
          </button>
          <button
            onClick={onRemove}
            className="w-full rounded-lg border border-brick/40 px-4 py-2.5 text-left text-sm font-medium text-brick hover:bg-brick/10"
          >
            ✕ Retirer du calendrier
          </button>
        </div>
      </div>
    </div>
  );
}

function GarnishModal({
  recipe,
  subtitle,
  defaultServings,
  onConfirm,
  onCancel,
}: {
  recipe: PickerRecipe;
  subtitle: string;
  defaultServings: number;
  onConfirm: (choices: Record<string, string[]>, servings: number) => void;
  onCancel: () => void;
}) {
  // Options par groupe (prédéfinies + ajoutées à la volée) et sélection multiple.
  const [options, setOptions] = useState<Record<string, string[]>>(
    Object.fromEntries(recipe.choiceGroups.map((g) => [g.id, [...g.choiceOptions]])),
  );
  const [selected, setSelected] = useState<Record<string, string[]>>(
    Object.fromEntries(recipe.choiceGroups.map((g) => [g.id, []])),
  );
  const [custom, setCustom] = useState<Record<string, string>>(
    Object.fromEntries(recipe.choiceGroups.map((g) => [g.id, ""])),
  );
  const [servings, setServings] = useState(String(defaultServings));

  function toggle(gid: string, opt: string) {
    setSelected((s) => {
      const cur = s[gid] ?? [];
      return {
        ...s,
        [gid]: cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt],
      };
    });
  }
  function addCustom(gid: string) {
    const v = (custom[gid] ?? "").trim();
    if (!v) return;
    setOptions((o) => ({
      ...o,
      [gid]: o[gid]?.some((x) => x.toLowerCase() === v.toLowerCase())
        ? o[gid]
        : [...(o[gid] ?? []), v],
    }));
    setSelected((s) => ({
      ...s,
      [gid]: (s[gid] ?? []).includes(v) ? s[gid] : [...(s[gid] ?? []), v],
    }));
    setCustom((c) => ({ ...c, [gid]: "" }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onCancel}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-2xl border border-line bg-parchment-card shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line p-5">
          <h2 className="text-xl text-ink">{recipe.name}</h2>
          <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Nombre de{" "}
              {recipe.name.toLowerCase().includes("pizza") ? "pizzas" : "portions"}
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="num w-24 rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>

          {recipe.choiceGroups.map((g) => (
            <div key={g.id}>
              <p className="mb-2 text-sm font-medium text-ink">
                {g.name}{" "}
                <span className="font-normal text-ink-soft">
                  (plusieurs possibles)
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(options[g.id] ?? []).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggle(g.id, opt)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      (selected[g.id] ?? []).includes(opt)
                        ? "border-gold bg-gold-soft/50 text-ink"
                        : "border-line text-ink-soft hover:text-ink",
                    )}
                  >
                    {(selected[g.id] ?? []).includes(opt) ? "✓ " : ""}
                    {opt}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={custom[g.id] ?? ""}
                  onChange={(e) =>
                    setCustom((c) => ({ ...c, [g.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustom(g.id);
                    }
                  }}
                  placeholder="Autre garniture…"
                  className="flex-1 rounded-lg border border-line bg-parchment px-3 py-1.5 text-sm text-ink outline-none focus:border-gold"
                />
                <button
                  onClick={() => addCustom(g.id)}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:bg-parchment"
                >
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-line p-4">
          <button
            onClick={onCancel}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              // Inclure une garniture tapée mais pas encore "Ajoutée".
              const finalChoices: Record<string, string[]> = {};
              for (const g of recipe.choiceGroups) {
                const set = [...(selected[g.id] ?? [])];
                const pending = (custom[g.id] ?? "").trim();
                if (pending && !set.some((x) => x.toLowerCase() === pending.toLowerCase()))
                  set.push(pending);
                finalChoices[g.id] = set;
              }
              onConfirm(
                finalChoices,
                Math.max(1, parseInt(servings, 10) || defaultServings),
              );
            }}
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
  selecting,
  isSelected,
  onClick,
}: {
  day: Week;
  mealTime: "MIDI" | "SOIR";
  cell?: MealCell;
  selecting: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  if (cell) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "block w-full rounded border-l-[3px] bg-parchment px-1.5 py-1 text-left text-[11px] leading-tight text-ink hover:bg-parchment-deep",
          CATEGORY_ACCENT[cell.category],
          selecting && isSelected && "ring-2 ring-brick",
          selecting && !isSelected && "opacity-70",
        )}
        title={cell.name}
      >
        <span className="block text-[9px] uppercase tracking-wide text-ink-soft">
          {selecting && (isSelected ? "☑ " : "☐ ")}
          {mealTime === "MIDI" ? "Midi" : "Soir"}
        </span>
        <span className="line-clamp-2">{cell.name}</span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={selecting}
      className={cn(
        "block w-full rounded border border-dashed border-line px-1.5 py-1 text-left text-[10px] text-ink-soft/70 hover:border-ink/40 hover:text-ink",
        (!day.inMonth || selecting) && "opacity-50",
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
  todayISO,
  onClose,
  onRun,
}: {
  monthLabel: string;
  todayISO: string;
  onClose: () => void;
  onRun: (
    scope: "month" | "sixmonths" | "custom",
    mode: "fill" | "replace",
    untilDate?: string,
  ) => void;
}) {
  const [scope, setScope] = useState<"month" | "sixmonths" | "custom">("month");
  const [mode, setMode] = useState<"fill" | "replace">("fill");
  const [untilDate, setUntilDate] = useState(toISO(addDays(fromISO(todayISO), 6)));

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
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-colors",
                scope === "custom"
                  ? "border-gold bg-gold-soft/40"
                  : "border-line hover:bg-parchment",
              )}
            >
              <input
                type="radio"
                checked={scope === "custom"}
                onChange={() => setScope("custom")}
                className="accent-gold"
              />
              <span className="text-sm text-ink">Jusqu’au</span>
              <input
                type="date"
                value={untilDate}
                min={todayISO}
                onChange={(e) => {
                  setUntilDate(e.target.value);
                  setScope("custom");
                }}
                onClick={() => setScope("custom")}
                className="num rounded-lg border border-line bg-parchment px-2 py-1 text-sm text-ink outline-none focus:border-gold"
              />
              <span className="text-xs text-ink-soft">(Ã  partir d’aujourd’hui)</span>
            </label>
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
            onClick={() => onRun(scope, mode, untilDate)}
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
