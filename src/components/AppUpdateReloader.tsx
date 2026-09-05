"use client";

import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { isStaleDeployMessage } from "@/lib/stale-deploy";

/**
 * Filet de sécurité pour l'erreur « onglet périmé après un redéploiement » :
 * si une Server Action échoue parce qu'une nouvelle version est en ligne, on
 * affiche un bandeau discret invitant à recharger — au lieu d'une action qui
 * échoue en silence. Se déclenche sur les erreurs non interceptées ailleurs.
 */
export function AppUpdateReloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      if (isStaleDeployMessage(e.error) || isStaleDeployMessage(e.message)) setShow(true);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      if (isStaleDeployMessage(e.reason)) setShow(true);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      role="alert"
      className="no-print fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-parchment-card/95 p-4 shadow-[0_-4px_24px_rgba(30,43,35,0.08)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          Une nouvelle version de <strong className="text-ink">{APP_NAME}</strong> est
          disponible. Rechargez la page pour continuer.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-parchment transition-opacity hover:opacity-90"
        >
          Recharger
        </button>
      </div>
    </div>
  );
}
