"use client";

import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/brand";

// Événement Chrome/Android d'invite d'installation (non typé par le DOM standard).
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Rend l'app installable (PWA) :
 * - enregistre le service worker globalement (installabilité + push) ;
 * - affiche un bouton « Installer l'app » via l'invite native Android/Chrome ;
 * - sur iOS (pas d'invite native), propose les instructions « Partager → Sur
 *   l'écran d'accueil ».
 */
export function InstallPwa() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  // Enregistrement du service worker (idempotent : sans effet s'il l'est déjà
  // via les rappels). Nécessaire pour l'installabilité Chrome et le push.
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* enregistrement best-effort */
      });
    }
  }, []);

  useEffect(() => {
    if (isDismissed() || isStandalone()) return;

    const onPrompt = (e: Event) => {
      e.preventDefault(); // on garde la main pour notre propre bouton
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* stockage indisponible */
      }
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    // iOS Safari n'émet jamais beforeinstallprompt : on propose les instructions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isIos()) setShow(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!show) return null;

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* stockage indisponible */
    }
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice.catch(() => null);
      setDeferred(null);
      setShow(false);
    } else {
      setIosHint(true); // iOS : afficher les instructions
    }
  };

  return (
    <div className="no-print fixed bottom-4 left-4 z-[65] max-w-[calc(100%-2rem)] sm:max-w-sm">
      {iosHint ? (
        <div className="rounded-2xl border border-line bg-parchment-card p-4 text-sm text-ink-soft shadow-[0_8px_30px_rgba(30,43,35,0.16)]">
          <p>
            Pour installer <strong className="text-ink">{APP_NAME}</strong> : appuyez sur{" "}
            <strong className="text-ink">Partager</strong>, puis{" "}
            <strong className="text-ink">« Sur l’écran d’accueil »</strong>.
          </p>
          <button
            onClick={close}
            className="mt-3 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-parchment transition-opacity hover:opacity-90"
          >
            J’ai compris
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-full border border-line bg-parchment-card p-1 shadow-[0_8px_30px_rgba(30,43,35,0.16)]">
          <button
            onClick={install}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-parchment transition-opacity hover:opacity-90"
          >
            📲 Installer l’app
          </button>
          <button
            onClick={close}
            aria-label="Masquer"
            className="px-2 py-2 text-sm text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
