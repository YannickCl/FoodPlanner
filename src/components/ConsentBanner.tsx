"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { CONSENT_KEY } from "@/lib/analytics";

/**
 * Bandeau de consentement cookies (RGPD/CNIL).
 * - Ne s'affiche que si un choix n'a pas déjà été fait.
 * - « Refuser » aussi accessible que « Accepter » (exigence CNIL).
 * - Par défaut, Consent Mode v2 est sur "denied" (posé dans le layout) : aucun
 *   cookie de mesure tant que l'utilisateur n'a pas accepté.
 */
function updateConsent(granted: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    /* stockage indisponible : on met quand même à jour le consentement runtime */
  }
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  const value = granted ? "granted" : "denied";
  const payload = { analytics_storage: value };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", payload);
  } else {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(["consent", "update", payload]);
  }
}

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let shouldShow = true;
    try {
      shouldShow = !localStorage.getItem(CONSENT_KEY);
    } catch {
      shouldShow = true;
    }
    // Lecture client-only du choix stocké : révéler le bandeau au montage est
    // ici le pattern correct (pas de localStorage côté serveur).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(shouldShow);
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="no-print fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-parchment-card/95 p-4 shadow-[0_-4px_24px_rgba(30,43,35,0.08)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          {APP_NAME} utilise des cookies de <strong className="text-ink">mesure
          d&rsquo;audience</strong> (Google Analytics) pour s&rsquo;améliorer. Tu
          peux refuser sans aucun impact sur ton utilisation.{" "}
          <Link href="/mentions-legales" className="underline hover:text-ink">
            En savoir plus
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => {
              updateConsent(false);
              setShow(false);
            }}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment-deep"
          >
            Tout refuser
          </button>
          <button
            onClick={() => {
              updateConsent(true);
              setShow(false);
            }}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-parchment transition-opacity hover:opacity-90"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
