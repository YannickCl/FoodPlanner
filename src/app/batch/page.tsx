import Link from "next/link";
import { getBatchMeals } from "@/lib/queries";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import {
  aggregateShoppingList,
  type PlannedRecipe,
  type RawIngredient,
} from "@/lib/shopping";
import { buildBatchPlan, type PlanStep } from "@/lib/batch";
import { guessAisle } from "@/lib/aisle";
import { AISLE_LABELS, AISLE_ORDER } from "@/lib/labels";
import { EQUIPMENT_LABEL, TYPE_LABEL } from "@/lib/steps";
import { Card } from "@/components/ui";
import { BatchSession, type GuidedStep } from "./BatchSession";

export const dynamic = "force-dynamic";

function parseCells(raw: string | undefined) {
  if (!raw) return [];
  const out: { date: string; mealTime: "MIDI" | "SOIR" }[] = [];
  for (const part of raw.split(",")) {
    const [date, mealTime] = part.split(":");
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && (mealTime === "MIDI" || mealTime === "SOIR")) {
      out.push({ date, mealTime });
    }
  }
  return out;
}

export default async function BatchPage({
  searchParams,
}: {
  searchParams: Promise<{ cells?: string }>;
}) {
  const sp = await searchParams;
  const cells = parseCells(sp.cells);

  const householdId = await getCurrentHouseholdId();
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    select: { plan: true },
  });
  const premium = household?.plan === "PREMIUM";

  const back = (
    <div className="mb-4">
      <Link href="/calendrier" className="text-sm text-ink-soft hover:text-ink">
        ← Retour au calendrier
      </Link>
    </div>
  );

  if (!premium) {
    return (
      <div className="mx-auto max-w-lg">
        {back}
        <Card className="p-6 text-center">
          <p className="mb-2 text-4xl">🍱</p>
          <h1 className="mb-2 font-display text-2xl text-ink">Batch cooking</h1>
          <p className="text-sm text-ink-soft">
            Prépare plusieurs repas d’un coup : une seule mise en place et un plan
            de cuisson optimisé. Cette fonctionnalité fait partie de l’offre{" "}
            <strong>premium</strong>.
          </p>
        </Card>
      </div>
    );
  }

  const meals = await getBatchMeals(cells);

  if (meals.length === 0) {
    return (
      <div className="mx-auto max-w-lg">
        {back}
        <Card className="p-6 text-center">
          <h1 className="mb-2 font-display text-2xl text-ink">Batch cooking</h1>
          <p className="text-sm text-ink-soft">
            Sélectionne des repas dans le calendrier (bouton « Modifier la
            sélection »), puis « Préparer en une fois ».
          </p>
        </Card>
      </div>
    );
  }

  // Ingrédients consolidés (mise en place) — réutilise l'agrégation des courses.
  const planned: PlannedRecipe[] = meals.map((m) => {
    const ingredients: RawIngredient[] = [];
    for (const i of m.ingredients) {
      if (i.isChoice) {
        const raw = m.choices[i.id];
        const chosen = Array.isArray(raw) ? raw : raw ? [raw] : [];
        for (const opt of chosen) {
          ingredients.push({ name: opt, quantity: null, unit: null, note: null, aisle: guessAisle(opt) });
        }
        continue;
      }
      ingredients.push({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
        note: i.note,
        aisle: i.aisle,
      });
    }
    return {
      recipeName: m.recipeName,
      servings: m.servings,
      servingsBase: m.servingsBase,
      ingredients,
    };
  });

  const list = aggregateShoppingList(planned);
  const plan = buildBatchPlan(meals.map((m) => ({ recipeName: m.recipeName, steps: m.steps })));
  const dishes = [...new Set(meals.map((m) => m.recipeName))];

  const toGuided = (s: PlanStep, phase: "prep" | "cook"): GuidedStep => ({
    recipe: s.recipe,
    text: s.text,
    phase,
    durationMin: s.structure.durationMin,
    equipment: s.structure.equipment,
    type: s.structure.type,
  });
  const orderedSteps: GuidedStep[] = [
    ...plan.miseEnPlace.map((s) => toGuided(s, "prep")),
    ...plan.cuissons.map((s) => toGuided(s, "cook")),
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {back}
      <p className="eyebrow mb-1">Tout préparer en une fois</p>
      <h1 className="mb-1 text-4xl text-ink">Batch cooking</h1>
      <p className="mb-2 text-sm text-ink-soft">
        <span className="num">{dishes.length}</span> plats · mise en place estimée
        ~<span className="num">{plan.activeMin || plan.miseEnPlace.length * 5}</span>{" "}
        min · plus longue cuisson <span className="num">{plan.longestCookMin}</span> min
      </p>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {dishes.map((d) => (
          <span key={d} className="rounded-full border border-line bg-parchment-card px-3 py-1 text-sm text-ink">
            {d}
          </span>
        ))}
      </div>

      {/* Session guidée (le cœur : on est pris par la main) */}
      <div className="mb-6">
        <BatchSession dishes={dishes} steps={orderedSteps} cells={cells} />
      </div>

      <p className="mb-3 text-sm text-ink-soft">
        Ou consulte le récap ci-dessous (ingrédients &amp; plan) avant de te lancer :
      </p>

      {/* Ingrédients consolidés */}
      <Card className="mb-4 p-5">
        <h2 className="mb-3 text-lg text-ink">🧺 Mise en place — ingrédients à sortir</h2>
        <div className="space-y-3">
          {AISLE_ORDER.filter((a) => list.groups.some((g) => g.aisle === a)).map((aisle) => {
            const group = list.groups.find((g) => g.aisle === aisle)!;
            return (
              <div key={aisle}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">
                  {AISLE_LABELS[aisle]}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((it, k) => (
                    <li key={k} className="text-sm text-ink">
                      {it.qtyLabel && <span className="num font-medium">{it.qtyLabel} </span>}
                      {it.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Plan de cuisson */}
      <Card className="mb-4 p-5">
        <h2 className="mb-1 text-lg text-ink">1️⃣ Mise en place (tout d’un coup)</h2>
        <p className="mb-3 text-xs text-ink-soft">
          Les gestes de préparation, regroupés — fais-les tous avant d’allumer le feu.
        </p>
        {plan.miseEnPlace.length === 0 ? (
          <p className="text-sm text-ink-soft">Rien à préparer en amont.</p>
        ) : (
          <ul className="space-y-2">
            {plan.miseEnPlace.map((s, k) => (
              <PlanRow key={k} step={s} />
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="mb-1 text-lg text-ink">2️⃣ Cuissons (les plus longues d’abord)</h2>
        <p className="mb-3 text-xs text-ink-soft">
          Lance d’abord les plus longues : pendant qu’elles tournent, enchaîne les
          suivantes.
        </p>
        {plan.cuissons.length === 0 ? (
          <p className="text-sm text-ink-soft">Aucune cuisson.</p>
        ) : (
          <ul className="space-y-2">
            {plan.cuissons.map((s, k) => (
              <PlanRow key={k} step={s} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function PlanRow({ step }: { step: PlanStep }) {
  const s = step.structure;
  return (
    <li className="rounded-lg border border-line/70 bg-parchment px-3 py-2">
      <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-ink">
          {step.recipe}
        </span>
        {s.equipment !== "aucun" && (
          <span className="text-[11px] text-ink-soft">{EQUIPMENT_LABEL[s.equipment]}</span>
        )}
        {s.durationMin !== null && (
          <span className="num text-[11px] text-ink-soft">⏱ {s.durationMin} min</span>
        )}
        <span className="text-[11px] text-ink-soft">{TYPE_LABEL[s.type]}</span>
      </div>
      <p className="text-sm text-ink">{step.text}</p>
    </li>
  );
}
