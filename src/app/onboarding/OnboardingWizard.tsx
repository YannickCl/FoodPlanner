"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { APP_NAME } from "@/lib/brand";
import { detectAllergens } from "@/lib/allergens";
import { saveOnboardingBasics, completeOnboarding } from "@/app/actions/onboarding";
import { generateRecipeAI, addRecipesAI, type AIRecipeWithAisle } from "@/app/actions/recipes";

interface Initial {
  householdName: string;
  servings: number;
  allergies: string[];
  forbidden: string[];
  lunchTime: string;
  lunchEnabled: boolean;
  dinnerTime: string;
  dinnerEnabled: boolean;
}

interface Dish {
  id: number;
  name: string;
  status: "loading" | "ready" | "error" | "added";
  recipe?: AIRecipeWithAisle;
  error?: string;
}

const STEPS = ["Foyer", "Allergies", "Repas", "Recettes"];

export function OnboardingWizard({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [householdName, setHouseholdName] = useState(initial.householdName);
  const [servings, setServings] = useState(String(initial.servings));
  const [allergies, setAllergies] = useState<string[]>(initial.allergies);
  const [forbidden, setForbidden] = useState<string[]>(initial.forbidden);
  const [noAllergy, setNoAllergy] = useState(initial.allergies.length === 0);
  const [lunchEnabled, setLunchEnabled] = useState(initial.lunchEnabled);
  const [lunchTime, setLunchTime] = useState(initial.lunchTime);
  const [dinnerEnabled, setDinnerEnabled] = useState(initial.dinnerEnabled);
  const [dinnerTime, setDinnerTime] = useState(initial.dinnerTime);

  const [dishInput, setDishInput] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [nextId, setNextId] = useState(1);
  const [added, setAdded] = useState(0);

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const step1ok = householdName.trim().length > 0 && Number(servings) >= 1;
  const step2ok = allergies.length > 0 || noAllergy;

  function goToRecipes() {
    setError(null);
    startTransition(async () => {
      try {
        await saveOnboardingBasics({
          householdName: householdName.trim(),
          servings,
          allergies,
          forbidden,
          lunchTime,
          lunchEnabled,
          dinnerTime,
          dinnerEnabled,
        });
        setStep(4);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  async function generateDish() {
    const name = dishInput.trim();
    if (!name) return;
    const id = nextId;
    setNextId((n) => n + 1);
    setDishInput("");
    setDishes((d) => [...d, { id, name, status: "loading" }]);
    const res = await generateRecipeAI(name);
    setDishes((d) =>
      d.map((x) =>
        x.id === id
          ? res.ok && res.recipe
            ? { ...x, status: "ready", recipe: res.recipe }
            : { ...x, status: "error", error: res.error || "Échec de la génération" }
          : x,
      ),
    );
  }

  function addDish(dish: Dish) {
    if (!dish.recipe) return;
    startTransition(async () => {
      const res = await addRecipesAI([dish.recipe!]);
      if (res.ok && res.count > 0) {
        setDishes((d) => d.map((x) => (x.id === dish.id ? { ...x, status: "added" } : x)));
        setAdded((a) => a + 1);
      } else {
        setDishes((d) =>
          d.map((x) =>
            x.id === dish.id
              ? { ...x, status: "error", error: "Limite gratuite atteinte (30 recettes)." }
              : x,
          ),
        );
      }
    });
  }

  function removeDish(id: number) {
    setDishes((d) => d.filter((x) => x.id !== id));
  }

  function finish() {
    startTransition(async () => {
      await completeOnboarding();
      router.replace("/calendrier");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl text-ink">Bienvenue sur {APP_NAME}</h1>
        <p className="mt-1 text-sm text-ink-soft">On configure ton foyer en 4 étapes.</p>
      </div>

      {/* Progression */}
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn(
                "h-1.5 w-full rounded-full transition-colors",
                i + 1 <= step ? "bg-gold" : "bg-line",
              )}
            />
            <span
              className={cn(
                "text-[11px]",
                i + 1 === step ? "font-semibold text-ink" : "text-ink-soft",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
      )}

      {/* Étape 1 : Foyer */}
      {step === 1 && (
        <Card className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Nom du foyer</label>
            <input
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="ex : La famille Martin"
              autoFocus
              className="w-full rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Nombre de personnes</label>
            <input
              type="number"
              min={1}
              max={50}
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="num w-28 rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <Nav onNext={() => setStep(2)} nextOk={step1ok} />
        </Card>
      )}

      {/* Étape 2 : Allergies / interdits */}
      {step === 2 && (
        <Card className="space-y-4 p-5">
          <TagField
            label="Allergies"
            hint="Ces ingrédients ne seront jamais proposés, et les recettes seront vérifiées."
            placeholder="ex : arachide, fruits de mer…"
            tags={allergies}
            onChange={(t) => {
              setAllergies(t);
              if (t.length > 0) setNoAllergy(false);
            }}
          />
          {allergies.length === 0 && (
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-gold-soft/40 px-3 py-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={noAllergy}
                onChange={(e) => setNoAllergy(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              Aucune allergie dans le foyer
            </label>
          )}
          <TagField
            label="Aliments interdits (optionnel)"
            hint="Aliments que la famille ne mange pas."
            placeholder="ex : porc, champignons…"
            tags={forbidden}
            onChange={setForbidden}
          />
          <Nav onPrev={() => setStep(1)} onNext={() => setStep(3)} nextOk={step2ok} />
          {!step2ok && (
            <p className="text-xs text-ink-soft">
              Renseigne au moins une allergie, ou coche « Aucune allergie ».
            </p>
          )}
        </Card>
      )}

      {/* Étape 3 : Heures des repas */}
      {step === 3 && (
        <Card className="space-y-3 p-5">
          <p className="text-sm text-ink-soft">
            Active les repas que tu veux planifier, et choisis l’heure (pour les
            rappels de cuisine).
          </p>
          <MealRow label="🌞 Déjeuner" enabled={lunchEnabled} onToggle={setLunchEnabled} time={lunchTime} onTime={setLunchTime} />
          <MealRow label="🌙 Dîner" enabled={dinnerEnabled} onToggle={setDinnerEnabled} time={dinnerTime} onTime={setDinnerTime} />
          <Nav
            onPrev={() => setStep(2)}
            onNext={goToRecipes}
            nextLabel={pending ? "…" : "Continuer"}
            nextOk={!pending}
          />
        </Card>
      )}

      {/* Étape 4 : Recettes favorites (IA) */}
      {step === 4 && (
        <div className="space-y-4">
          <Card className="p-5">
            <label className="mb-1 block text-sm font-medium text-ink">
              Tes plats favoris
            </label>
            <p className="mb-3 text-xs text-ink-soft">
              Donne le nom d’un plat que ta famille aime : l’IA en crée la recette,
              tu la valides. <span className="num">{added}</span>/30 ajoutées (offre gratuite).
            </p>
            <div className="flex gap-2">
              <input
                value={dishInput}
                onChange={(e) => setDishInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void generateDish();
                  }
                }}
                placeholder="ex : Lasagnes, Poulet rôti…"
                className="flex-1 rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
              <button
                onClick={() => void generateDish()}
                disabled={!dishInput.trim()}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink hover:opacity-90 disabled:opacity-50"
              >
                Générer
              </button>
            </div>
          </Card>

          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              allergies={allergies}
              onAdd={() => addDish(dish)}
              onRemove={() => removeDish(dish.id)}
              busy={pending}
            />
          ))}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-ink-soft">
              {added > 0 ? `${added} recette(s) ajoutée(s) 🎉` : "Tu pourras en ajouter d’autres plus tard."}
            </span>
            <button
              onClick={finish}
              disabled={pending}
              className="rounded-full bg-ink px-6 py-2.5 font-medium text-parchment hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "…" : "Terminer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Nav({
  onPrev,
  onNext,
  nextOk = true,
  nextLabel = "Continuer",
}: {
  onPrev?: () => void;
  onNext: () => void;
  nextOk?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onPrev ? (
        <button
          onClick={onPrev}
          className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:bg-parchment-deep"
        >
          ← Retour
        </button>
      ) : (
        <span />
      )}
      <button
        onClick={onNext}
        disabled={!nextOk}
        className="rounded-full bg-ink px-6 py-2.5 font-medium text-parchment hover:opacity-90 disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function DishCard({
  dish,
  allergies,
  onAdd,
  onRemove,
  busy,
}: {
  dish: Dish;
  allergies: string[];
  onAdd: () => void;
  onRemove: () => void;
  busy: boolean;
}) {
  const flagged =
    dish.recipe ? detectAllergens(dish.recipe.ingredients.map((i) => i.name), allergies) : [];

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-display text-lg text-ink">{dish.name}</span>
        {dish.status === "added" && (
          <span className="rounded-full bg-green/15 px-2.5 py-1 text-xs font-medium text-green">
            ✓ Ajoutée
          </span>
        )}
      </div>

      {dish.status === "loading" && (
        <p className="text-sm text-ink-soft">✨ Génération de la recette…</p>
      )}
      {dish.status === "error" && (
        <p className="text-sm text-brick">{dish.error}</p>
      )}

      {dish.recipe && dish.status !== "error" && (
        <>
          {flagged.length > 0 && (
            <p className="mb-2 rounded-lg bg-brick/10 px-3 py-2 text-sm font-medium text-brick">
              ⚠️ Contient un allergène déclaré : {flagged.join(", ")} — vérifie avant d’ajouter.
            </p>
          )}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {dish.recipe.ingredients.map((ing, k) => {
              const isAllergen =
                detectAllergens([ing.name], allergies).length > 0;
              return (
                <span
                  key={k}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs",
                    isAllergen
                      ? "border-brick/40 bg-brick/10 font-medium text-brick"
                      : "border-line bg-parchment text-ink-soft",
                  )}
                >
                  {ing.name}
                </span>
              );
            })}
          </div>
          {dish.status !== "added" && (
            <div className="flex gap-2">
              <button
                onClick={onAdd}
                disabled={busy}
                className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-parchment hover:opacity-90 disabled:opacity-60"
              >
                Ajouter à mon carnet
              </button>
              <button
                onClick={onRemove}
                disabled={busy}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft hover:bg-parchment-deep"
              >
                Ignorer
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function TagField({
  label,
  hint,
  placeholder,
  tags,
  onChange,
}: {
  label: string;
  hint: string;
  placeholder: string;
  tags: string[];
  onChange: (t: string[]) => void;
}) {
  const [value, setValue] = useState("");
  function add() {
    const v = value.trim();
    if (v && !tags.some((t) => t.toLowerCase() === v.toLowerCase())) onChange([...tags, v]);
    setValue("");
  }
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <p className="mb-2 text-xs text-ink-soft">{hint}</p>
      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full border border-brick/30 bg-brick/10 px-2.5 py-1 text-sm text-brick"
            >
              {t}
              <button onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Retirer ${t}`}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
        <button
          onClick={add}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-parchment-deep"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

function MealRow({
  label,
  enabled,
  onToggle,
  time,
  onTime,
}: {
  label: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  time: string;
  onTime: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-parchment px-3 py-2">
      <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-4 w-4 accent-gold"
        />
        {label}
      </label>
      <input
        type="time"
        value={time}
        onChange={(e) => onTime(e.target.value)}
        disabled={!enabled}
        className="num rounded-lg border border-line bg-parchment-card px-2 py-1 text-sm text-ink outline-none focus:border-gold disabled:opacity-40"
      />
    </div>
  );
}
