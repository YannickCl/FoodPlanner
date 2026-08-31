"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui";
import { createCheckoutSession, createPortalSession } from "@/app/actions/billing";

export function SubscriptionCard({
  premium,
  hasStripeCustomer,
}: {
  premium: boolean;
  hasStripeCustomer: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function checkout(interval: "monthly" | "annual") {
    setError(null);
    startTransition(async () => {
      const r = await createCheckoutSession(interval);
      if (r.ok && r.url) window.location.href = r.url;
      else setError(r.error ?? "Erreur");
    });
  }
  function portal() {
    setError(null);
    startTransition(async () => {
      const r = await createPortalSession();
      if (r.ok && r.url) window.location.href = r.url;
      else setError(r.error ?? "Erreur");
    });
  }

  return (
    <Card className="p-5">
      <label className="mb-1 block text-sm font-medium text-ink">💳 Abonnement</label>

      {premium ? (
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-green/15 px-3 py-1.5 text-sm font-medium text-green">
            ✓ Premium actif
          </p>
          {hasStripeCustomer ? (
            <div>
              <button
                onClick={portal}
                disabled={pending}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-parchment-deep disabled:opacity-60"
              >
                {pending ? "…" : "Gérer mon abonnement"}
              </button>
              <p className="mt-2 text-xs text-ink-soft">
                Facturation, changement d’offre ou résiliation via le portail sécurisé.
              </p>
            </div>
          ) : (
            <p className="text-xs text-ink-soft">Offre fondateur — accès premium complet.</p>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs text-ink-soft">
            Débloque l’IA, le planning automatique et le batch cooking. Essai gratuit
            de 7 jours.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => checkout("annual")}
              disabled={pending}
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:opacity-90 disabled:opacity-60"
            >
              Annuel — 60 €/an
            </button>
            <button
              onClick={() => checkout("monthly")}
              disabled={pending}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-parchment-deep disabled:opacity-60"
            >
              Mensuel — 5,99 €/mois
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-soft">Sans engagement, résiliable à tout moment.</p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-brick">{error}</p>}
    </Card>
  );
}
