"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  Aisle,
  Category,
  DayType,
  MealTime,
  Season,
  StarchFamily,
  Unit,
} from "@/generated/prisma/enums";
import {
  AISLE_LABELS,
  CATEGORY_LABELS,
  DAYTYPE_LABELS,
  MEALTIME_LABELS,
  SEASON_LABELS,
  STARCH_FAMILY_LABELS,
  UNIT_LABELS,
  enumOptions,
} from "@/lib/labels";
import { parseIngredient } from "@/lib/parse-ingredient";
import { guessAisle } from "@/lib/aisle";
import {
  generateRecipeAI,
  type ActionResult,
  type AIRecipeWithAisle,
} from "@/app/actions/recipes";
import { Card } from "@/components/ui";

interface IngredientRow {
  name: string;
  quantity: string;
  unit: Unit | "";
  note: string;
  aisle: Aisle;
  isChoice: boolean;
  options: string; // options séparées par des virgules (si isChoice)
}

export interface RecipeFormInitial {
  name: string;
  category: Category;
  prepTime: string;
  containsStarch: boolean;
  starchFamily: StarchFamily | null;
  season: Season;
  mealTime: MealTime;
  dayType: DayType;
  minGapDays: number;
  servingsBase: number;
  steps: string[];
  ingredients: IngredientRow[];
}

const emptyRow = (): IngredientRow => ({
  name: "",
  quantity: "",
  unit: "",
  note: "",
  aisle: "AUTRES",
  isChoice: false,
  options: "",
});

const EMPTY: RecipeFormInitial = {
  name: "",
  category: "HEALTHY",
  prepTime: "",
  containsStarch: false,
  starchFamily: null,
  season: "ALL",
  mealTime: "BOTH",
  dayType: "BOTH",
  minGapDays: 14,
  servingsBase: 6,
  steps: [],
  ingredients: [emptyRow()],
};

export function RecipeForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: RecipeFormInitial;
  action: (input: unknown) => Promise<ActionResult>;
  submitLabel: string;
}) {
  const start = initial ?? EMPTY;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState(start.name);
  const [category, setCategory] = useState<Category>(start.category);
  const [prepTime, setPrepTime] = useState(start.prepTime);
  const [containsStarch, setContainsStarch] = useState(start.containsStarch);
  const [starchFamily, setStarchFamily] = useState<StarchFamily | "">(
    start.starchFamily ?? "",
  );
  const [season, setSeason] = useState<Season>(start.season);
  const [mealTime, setMealTime] = useState<MealTime>(start.mealTime);
  const [dayType, setDayType] = useState<DayType>(start.dayType);
  const [minGapDays, setMinGapDays] = useState(String(start.minGapDays));
  const [servingsBase, setServingsBase] = useState(String(start.servingsBase));
  const [steps, setSteps] = useState(start.steps.join("\n"));
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    start.ingredients.length ? start.ingredients : [emptyRow()],
  );
  const [bulk, setBulk] = useState("");

  // --- IA ---
  const [aiPending, startAi] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);

  function applyAI(rec: AIRecipeWithAisle) {
    setCategory(rec.category);
    setPrepTime(rec.prepTime);
    setContainsStarch(rec.containsStarch);
    setStarchFamily(rec.starchFamily ?? "");
    setSeason(rec.season);
    setMealTime(rec.mealTime);
    setDayType(rec.dayType);
    setMinGapDays(String(rec.minGapDays));
    setSteps(rec.steps.join("\n"));
    setIngredients(
      rec.ingredients.map((i) => ({
        name: i.name,
        quantity: i.quantity !== null ? String(i.quantity) : "",
        unit: (i.unit ?? "") as Unit | "",
        note: i.note ?? "",
        aisle: i.aisle as Aisle,
        isChoice: false,
        options: "",
      })),
    );
  }

  function runAI() {
    setAiError(null);
    startAi(async () => {
      const res = await generateRecipeAI(name);
      if (res.ok && res.recipe) applyAI(res.recipe);
      else setAiError(res.error ?? "Échec de la génération IA");
    });
  }

  function updateIng(i: number, patch: Partial<IngredientRow>) {
    setIngredients((rows) =>
      rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }
  function addIng() {
    setIngredients((r) => [...r, emptyRow()]);
  }
  function removeIng(i: number) {
    setIngredients((r) => r.filter((_, idx) => idx !== i));
  }
  function importBulk() {
    const lines = bulk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const parsed: IngredientRow[] = lines.map((line) => {
      const p = parseIngredient(line);
      return {
        name: p.name,
        quantity: p.quantity !== null ? String(p.quantity) : "",
        unit: p.unit ?? "",
        note: p.note ?? "",
        aisle: guessAisle(p.name),
        isChoice: false,
        options: "",
      };
    });
    setIngredients((rows) => [
      ...rows.filter((r) => r.name.trim() !== ""),
      ...parsed,
    ]);
    setBulk("");
  }

  function submit() {
    setErrors({});
    const input = {
      name,
      category,
      prepTime,
      containsStarch,
      starchFamily: containsStarch ? starchFamily || null : null,
      season,
      mealTime,
      dayType,
      minGapDays,
      servingsBase,
      steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
      ingredients: ingredients
        .filter((i) => i.name.trim() !== "")
        .map((i) => ({
          name: i.name.trim(),
          quantity: i.isChoice ? "" : i.quantity,
          unit: i.isChoice ? null : i.unit || null,
          note: i.isChoice ? null : i.note || null,
          aisle: i.aisle,
          isChoice: i.isChoice,
          choiceOptions: i.isChoice
            ? i.options.split(",").map((o) => o.trim()).filter(Boolean)
            : [],
        })),
    };

    startTransition(async () => {
      const res = await action(input);
      if (res && !res.ok && res.fieldErrors) setErrors(res.fieldErrors);
    });
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <Field label="Nom" error={errors.name}>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="Poulet au curry"
            />
            <button
              type="button"
              onClick={runAI}
              disabled={aiPending || !name.trim()}
              className="shrink-0 rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
              title="Remplir la recette avec l'IA à partir du nom"
            >
              {aiPending ? "…" : "✨ Générer avec l'IA"}
            </button>
          </div>
          {aiError && <p className="mt-1 text-xs text-brick">{aiError}</p>}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Catégorie">
            <Select value={category} onChange={(v) => setCategory(v as Category)}>
              {enumOptions(CATEGORY_LABELS).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Temps de préparation" error={errors.prepTime}>
            <input
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className={inputCls}
              placeholder="30 min"
            />
          </Field>
          <Field label="Repas">
            <Select value={mealTime} onChange={(v) => setMealTime(v as MealTime)}>
              {enumOptions(MEALTIME_LABELS).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Type de jour">
            <Select value={dayType} onChange={(v) => setDayType(v as DayType)}>
              {enumOptions(DAYTYPE_LABELS).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Saison">
            <Select value={season} onChange={(v) => setSeason(v as Season)}>
              {enumOptions(SEASON_LABELS).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Espacement (j)">
              <input
                type="number"
                value={minGapDays}
                onChange={(e) => setMinGapDays(e.target.value)}
                className={`${inputCls} num`}
              />
            </Field>
            <Field label="Portions">
              <input
                type="number"
                value={servingsBase}
                onChange={(e) => setServingsBase(e.target.value)}
                className={`${inputCls} num`}
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-parchment p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={containsStarch}
              onChange={(e) => setContainsStarch(e.target.checked)}
              className="h-4 w-4 accent-brick"
            />
            Contient un féculent (réservé au déjeuner)
          </label>
          {containsStarch && (
            <Field label="Famille" error={errors.starchFamily} inline>
              <Select
                value={starchFamily}
                onChange={(v) => setStarchFamily(v as StarchFamily)}
              >
                <option value="">— choisir —</option>
                {enumOptions(STARCH_FAMILY_LABELS).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-ink">Ingrédients</h2>
          <button
            type="button"
            onClick={addIng}
            className="text-sm font-medium text-green hover:underline"
          >
            + Ajouter une ligne
          </button>
        </div>
        {errors.ingredients && (
          <p className="text-sm text-brick">{errors.ingredients}</p>
        )}

        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="rounded-lg border border-line/70 p-2">
              <div
                className={
                  ing.isChoice
                    ? "grid grid-cols-[1fr_130px_32px] items-center gap-2"
                    : "grid grid-cols-[70px_90px_1fr_1fr_130px_32px] items-center gap-2"
                }
              >
                {!ing.isChoice && (
                  <>
                    <input
                      value={ing.quantity}
                      onChange={(e) => updateIng(i, { quantity: e.target.value })}
                      placeholder="Qté"
                      className={`${inputSm} num`}
                    />
                    <Select
                      value={ing.unit}
                      onChange={(v) => updateIng(i, { unit: v as Unit | "" })}
                      small
                    >
                      <option value="">unité</option>
                      {enumOptions(UNIT_LABELS).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label || "pièce"}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
                <input
                  value={ing.name}
                  onChange={(e) => updateIng(i, { name: e.target.value })}
                  placeholder={ing.isChoice ? "Nom (ex: Garniture)" : "Ingrédient"}
                  className={inputSm}
                />
                {!ing.isChoice && (
                  <input
                    value={ing.note}
                    onChange={(e) => updateIng(i, { note: e.target.value })}
                    placeholder="Note (émincé…)"
                    className={inputSm}
                  />
                )}
                <Select
                  value={ing.aisle}
                  onChange={(v) => updateIng(i, { aisle: v as Aisle })}
                  small
                >
                  {enumOptions(AISLE_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
                <button
                  type="button"
                  onClick={() => removeIng(i)}
                  className="text-ink-soft hover:text-brick"
                  title="Retirer"
                >
                  ✕
                </button>
              </div>
              {ing.isChoice && (
                <input
                  value={ing.options}
                  onChange={(e) => updateIng(i, { options: e.target.value })}
                  placeholder="Options au choix, séparées par des virgules (jambon, champignons, chorizo…)"
                  className={`${inputSm} mt-2`}
                />
              )}
              <label className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={ing.isChoice}
                  onChange={(e) => updateIng(i, { isChoice: e.target.checked })}
                  className="h-3.5 w-3.5 accent-gold"
                />
                Garniture au choix (choisie au moment de planifier)
              </label>
            </div>
          ))}
        </div>

        <details className="rounded-lg border border-line bg-parchment p-3">
          <summary className="cursor-pointer text-sm font-medium text-ink-soft">
            Coller du texte (une ligne par ingrédient)
          </summary>
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={4}
            placeholder={"900g de blancs de poulet\n2 oignons\nSel, poivre"}
            className={`${inputCls} mt-2`}
          />
          <button
            type="button"
            onClick={importBulk}
            className="mt-2 rounded-full bg-green px-3 py-1.5 text-sm font-medium text-parchment"
          >
            Analyser et ajouter
          </button>
        </details>
      </Card>

      <Card className="space-y-3 p-5">
        <h2 className="text-lg text-ink">Préparation</h2>
        <p className="text-xs text-ink-soft">Une étape par ligne.</p>
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          rows={8}
          className={inputCls}
          placeholder={"Émincer les oignons…\nFaire revenir le poulet…"}
        />
      </Card>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="rounded-full bg-ink px-6 py-2.5 font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-line px-5 py-2.5 text-ink-soft hover:text-ink"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
const inputSm =
  "w-full rounded-lg border border-line bg-parchment px-2 py-1.5 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold/30";

function Field({
  label,
  error,
  inline,
  children,
}: {
  label: string;
  error?: string;
  inline?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={inline ? "" : "w-full"}>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-brick">{error}</p>}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  small,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={small ? inputSm : inputCls}
    >
      {children}
    </select>
  );
}
