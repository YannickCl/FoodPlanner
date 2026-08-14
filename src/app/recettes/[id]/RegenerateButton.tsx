"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regenerateRecipe } from "@/app/actions/recipes";
import { cn } from "@/lib/cn";

interface Question {
  q: string;
  options: { text: string; ok: boolean }[];
  fact: string;
}

const QUESTIONS: Question[] = [
  {
    q: "Pourquoi le riz cantonais se fait-il avec du riz froid ?",
    options: [
      { text: "Les grains ne collent pas", ok: true },
      { text: "Ça cuit plus vite", ok: false },
      { text: "C'est plus joli", ok: false },
    ],
    fact: "Un riz refroidi (idéalement de la veille) se défait en grains à la cuisson.",
  },
  {
    q: "Le batch cooking, c'est…",
    options: [
      { text: "Cuisiner plusieurs repas d'un coup", ok: true },
      { text: "Cuisiner sans four", ok: false },
      { text: "Commander au restaurant", ok: false },
    ],
    fact: "Une seule session de cuisine pour couvrir plusieurs repas de la semaine.",
  },
  {
    q: "Pour faire sauter à feu vif, quel ustensile est idéal ?",
    options: [
      { text: "Le wok", ok: true },
      { text: "Le moule à gâteau", ok: false },
      { text: "La cocotte fermée", ok: false },
    ],
    fact: "Le wok chauffe fort et permet de faire sauter en remuant sans coller.",
  },
  {
    q: "« Émincer » un oignon, ça veut dire…",
    options: [
      { text: "Le couper en fines lamelles", ok: true },
      { text: "Le faire bouillir", ok: false },
      { text: "Le râper", ok: false },
    ],
    fact: "Émincer = tailler en tranches fines et régulières.",
  },
  {
    q: "En batch cooking, on lance d'abord…",
    options: [
      { text: "Les cuissons les plus longues", ok: true },
      { text: "Le dessert", ok: false },
      { text: "La vaisselle", ok: false },
    ],
    fact: "On démarre les longues cuissons, puis on enchaîne le reste pendant ce temps.",
  },
  {
    q: "Un plat cuisiné se garde au frigo environ…",
    options: [
      { text: "3 à 4 jours", ok: true },
      { text: "3 semaines", ok: false },
      { text: "2 mois", ok: false },
    ],
    fact: "Au-delà, direction le congélateur !",
  },
  {
    q: "« Faire revenir » un aliment, c'est…",
    options: [
      { text: "Le cuire à feu vif dans un peu de matière grasse", ok: true },
      { text: "Le laisser mariner", ok: false },
      { text: "Le congeler", ok: false },
    ],
    fact: "On le saisit rapidement pour le colorer et développer les arômes.",
  },
  {
    q: "Pour une viande bien saisie, on cherche…",
    options: [
      { text: "Une belle croûte dorée", ok: true },
      { text: "Beaucoup d'eau rendue", ok: false },
      { text: "Une couleur grise", ok: false },
    ],
    fact: "Une poêle bien chaude = croûte dorée et jus préservés.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Status = "generating" | "done" | "error";

export function RegenerateButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("generating");
  const [error, setError] = useState<string | null>(null);

  // Quiz — l'ordre des questions et des réponses est mélangé à l'ouverture.
  const [deck, setDeck] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  async function start() {
    setDeck(shuffle(QUESTIONS).map((q) => ({ ...q, options: shuffle(q.options) })));
    setQi(0);
    setPicked(null);
    setScore(0);
    setStatus("generating");
    setError(null);
    setOpen(true);
    const res = await regenerateRecipe(recipeId);
    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(res.error ?? "Erreur");
    }
  }

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (deck[qi].options[i].ok) setScore((s) => s + 1);
  }
  function nextQuestion() {
    setPicked(null);
    setQi((v) => (v + 1) % deck.length);
  }

  function seeRecipe() {
    setOpen(false);
    router.refresh();
  }

  const question = deck[qi];

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
            {/* Bandeau de statut */}
            {status === "generating" && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-gold-soft/50 px-3 py-2 text-sm text-ink">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                L’IA cuisine ta nouvelle recette… joue en attendant !
              </div>
            )}
            {status === "done" && (
              <div className="mb-4 rounded-xl bg-green/15 px-3 py-2 text-sm font-medium text-green">
                ✓ Ta nouvelle recette est prête ! Score : {score}/{qi + (picked !== null ? 1 : 0)}
              </div>
            )}
            {status === "error" && (
              <div className="mb-4 rounded-xl bg-brick/10 px-3 py-2 text-sm text-brick">
                {error} — réessaie plus tard.
              </div>
            )}

            {/* Quiz */}
            {question && (
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-ink-soft">
                  🧠 Quiz cuisine · question {qi + 1}
                </p>
                <p className="mb-4 font-display text-xl leading-snug text-ink">{question.q}</p>
                <div className="space-y-2">
                  {question.options.map((o, i) => {
                    const revealed = picked !== null;
                    const isPicked = picked === i;
                    return (
                      <button
                        key={i}
                        onClick={() => pick(i)}
                        disabled={revealed}
                        className={cn(
                          "block w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
                          !revealed && "border-line bg-parchment hover:border-gold",
                          revealed && o.ok && "border-green/50 bg-green/15 text-green",
                          revealed && isPicked && !o.ok && "border-brick/50 bg-brick/10 text-brick",
                          revealed && !isPicked && !o.ok && "border-line bg-parchment opacity-60",
                        )}
                      >
                        {o.text}
                        {revealed && o.ok && " ✓"}
                        {revealed && isPicked && !o.ok && " ✗"}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <p className="mt-3 rounded-lg bg-parchment px-3 py-2 text-xs text-ink-soft">
                    💡 {question.fact}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between gap-2">
              {picked !== null ? (
                <button
                  onClick={nextQuestion}
                  className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-parchment-deep"
                >
                  Question suivante →
                </button>
              ) : (
                <span className="text-xs text-ink-soft">Choisis une réponse</span>
              )}

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
                <span className="text-xs text-ink-soft">⏳ Génération…</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
