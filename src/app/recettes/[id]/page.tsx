import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/queries";
import { deleteRecipe } from "@/app/actions/recipes";
import {
  CATEGORY_LABELS,
  DAYTYPE_LABELS,
  MEALTIME_LABELS,
  SEASON_LABELS,
  STARCH_FAMILY_LABELS,
  UNIT_LABELS,
  AISLE_LABELS,
  AISLE_ORDER,
} from "@/lib/labels";
import { CategoryBadge, StarchBadge, Card } from "@/components/ui";
import { DeleteRecipeButton } from "./DeleteRecipeButton";
import { RegenerateButton } from "./RegenerateButton";
import { FavoriteToggle } from "./FavoriteToggle";
import { classifyStep, EQUIPMENT_LABEL, TYPE_LABEL } from "@/lib/steps";
import { prisma } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/tenant";
import type { Aisle } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  const householdId = await getCurrentHouseholdId();
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    select: { plan: true },
  });
  const premium = household?.plan === "PREMIUM";

  const byAisle = new Map<Aisle, typeof recipe.ingredients>();
  for (const ing of recipe.ingredients) {
    const arr = byAisle.get(ing.aisle) ?? [];
    arr.push(ing);
    byAisle.set(ing.aisle, arr);
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/recettes" className="text-sm text-ink-soft hover:text-ink">
          ← Toutes les recettes
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Recette</p>
          <h1 className="text-4xl leading-tight text-ink">{recipe.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={recipe.category} />
            <StarchBadge contains={recipe.containsStarch} />
            {recipe.starchFamily && (
              <span className="rounded-full border border-line bg-parchment px-2 py-0.5 text-xs text-ink-soft">
                {STARCH_FAMILY_LABELS[recipe.starchFamily]}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {recipe.steps.length > 0 && (
            <Link
              href={`/recettes/${recipe.id}/cuisiner`}
              className="rounded-full bg-brick px-5 py-2 text-sm font-semibold text-parchment shadow-sm transition-opacity hover:opacity-90"
            >
              🍳 Lancer la recette
            </Link>
          )}
          <FavoriteToggle recipeId={recipe.id} initial={recipe.isFavorite} />
          {premium && <RegenerateButton recipeId={recipe.id} />}
          <Link
            href={`/recettes/${recipe.id}/edit`}
            className="rounded-full border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-parchment"
          >
            Modifier
          </Link>
          <DeleteRecipeButton
            deleteAction={deleteRecipe.bind(null, recipe.id)}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="mb-3 text-lg text-ink">Ingrédients</h2>
            <p className="mb-3 text-xs text-ink-soft">
              Pour <span className="num">{recipe.servingsBase}</span> personnes
            </p>
            <div className="space-y-3">
              {AISLE_ORDER.filter((a) => byAisle.has(a)).map((aisle) => (
                <div key={aisle}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">
                    {AISLE_LABELS[aisle]}
                  </p>
                  <ul className="space-y-0.5">
                    {byAisle.get(aisle)!.map((ing) =>
                      ing.isChoice ? (
                        <li key={ing.id} className="text-sm text-ink">
                          <span className="font-medium">{ing.name}</span>
                          <span className="text-ink-soft">
                            {" "}
                            — au choix : {ing.choiceOptions.join(", ")}
                          </span>
                        </li>
                      ) : (
                        <li key={ing.id} className="text-sm text-ink">
                          {ing.quantity !== null && (
                            <span className="num font-medium">
                              {formatQty(ing.quantity)}
                              {ing.unit && UNIT_LABELS[ing.unit]
                                ? ` ${UNIT_LABELS[ing.unit]}`
                                : ""}{" "}
                            </span>
                          )}
                          {ing.name}
                          {ing.note && (
                            <span className="text-ink-soft"> ({ing.note})</span>
                          )}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-lg text-ink">Fiche</h2>
            <dl className="space-y-1.5 text-sm">
              <Row label="Temps" value={recipe.prepTime} mono />
              <Row label="Catégorie" value={CATEGORY_LABELS[recipe.category]} />
              <Row label="Repas" value={MEALTIME_LABELS[recipe.mealTime]} />
              <Row label="Jour" value={DAYTYPE_LABELS[recipe.dayType]} />
              <Row label="Saison" value={SEASON_LABELS[recipe.season]} />
              <Row
                label="Espacement min."
                value={`${recipe.minGapDays} jours`}
                mono
              />
            </dl>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="mb-4 text-lg text-ink">Préparation</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, i) => {
              const s = classifyStep(step);
              return (
                <li key={i} className="flex gap-3">
                  <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-soft text-sm font-semibold text-ink">
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-ink">{step}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <StepBadge>{TYPE_LABEL[s.type]}</StepBadge>
                      {s.equipment !== "aucun" && (
                        <StepBadge>{EQUIPMENT_LABEL[s.equipment]}</StepBadge>
                      )}
                      {s.durationMin !== null && (
                        <StepBadge>⏱ {s.durationMin} min</StepBadge>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-1.5">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={mono ? "num text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}

function formatQty(q: number): string {
  return Number.isInteger(q) ? q.toString() : q.toString();
}

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-parchment px-2 py-0.5 text-[11px] text-ink-soft">
      {children}
    </span>
  );
}
