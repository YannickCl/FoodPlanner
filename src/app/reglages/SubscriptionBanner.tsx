"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Bandeau de retour de paiement Stripe, piloté par `?abonnement=ok|annule`.
 * Gère la course webhook ↔ redirection : si le retour est "ok" mais que le
 * foyer n'est pas encore passé PREMIUM (le webhook n'a pas fini), on rafraîchit
 * quelques fois en affichant « activation en cours… » jusqu'à ce que le plan
 * bascule (ou qu'on atteigne la limite d'essais).
 */
export function SubscriptionBanner({
  status,
  premium,
}: {
  status: "ok" | "annule" | null;
  premium: boolean;
}) {
  const router = useRouter();
  const [tries, setTries] = useState(0);
  const MAX_TRIES = 5; // ~10 s

  useEffect(() => {
    if (status !== "ok" || premium || tries >= MAX_TRIES) return;
    const t = setTimeout(() => {
      setTries((n) => n + 1);
      router.refresh();
    }, 2000);
    return () => clearTimeout(t);
  }, [status, premium, tries, router]);

  if (!status) return null;

  if (status === "annule") {
    return (
      <div className="mb-6 rounded-xl border border-line bg-parchment-deep/50 px-4 py-3 text-sm text-ink-soft">
        Paiement annulé — aucun montant n’a été débité. Tu peux réessayer quand tu
        veux.
      </div>
    );
  }

  // status === "ok"
  if (premium) {
    return (
      <div className="mb-6 rounded-xl border border-green/30 bg-green/10 px-4 py-3 text-sm text-ink">
        🎉 <strong className="font-semibold">Bienvenue en Premium !</strong> Ton essai
        gratuit de 7 jours a commencé — profite de l’assistant IA, du planning
        automatique et du batch cooking.
      </div>
    );
  }

  // Paiement reçu mais foyer pas encore PREMIUM : le webhook finit son travail.
  return (
    <div className="mb-6 rounded-xl border border-gold/30 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
      Paiement reçu ✓ —{" "}
      {tries >= MAX_TRIES ? (
        <>
          l’activation prend un peu plus de temps que prévu. Recharge la page dans
          un instant.
        </>
      ) : (
        <>activation de ton accès Premium en cours…</>
      )}
    </div>
  );
}
