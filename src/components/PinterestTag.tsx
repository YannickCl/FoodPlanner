"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, CONSENT_KEY, PINTEREST_TAG_ID } from "@/lib/analytics";

// Fonction pintrk (file d'attente Pinterest) — typée pour éviter `any`.
type Pintrk = ((...args: unknown[]) => void) & { queue: unknown[]; version: string };

function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

// Charge le tag de base Pinterest (snippet officiel) puis déclenche PageVisit.
// N'est appelée qu'APRÈS consentement ; idempotente (ne recharge pas si déjà là).
function loadPinterest() {
  const w = window as unknown as { pintrk?: Pintrk };
  if (w.pintrk || !PINTEREST_TAG_ID) return;

  const pintrk = function (...args: unknown[]) {
    pintrk.queue.push(args);
  } as Pintrk;
  pintrk.queue = [];
  pintrk.version = "3.0";
  w.pintrk = pintrk;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://s.pinimg.com/ct/core.js";
  const first = document.getElementsByTagName("script")[0];
  first.parentNode?.insertBefore(s, first);

  // Pas d'enhanced match (`em`) : visiteurs anonymes sur la vitrine.
  pintrk("load", PINTEREST_TAG_ID);
  pintrk("page");
}

/**
 * Tag Pinterest, chargé uniquement après consentement (traceur publicitaire).
 * - Au montage : charge si le consentement a déjà été donné.
 * - Sinon : écoute l'événement de consentement pour charger dès l'acceptation,
 *   sans rechargement de page.
 */
export function PinterestTag() {
  useEffect(() => {
    if (!PINTEREST_TAG_ID) return;
    if (hasConsent()) {
      loadPinterest();
      return;
    }
    const onChange = () => {
      if (hasConsent()) loadPinterest();
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return null;
}
