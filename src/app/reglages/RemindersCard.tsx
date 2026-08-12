"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

type State =
  | "loading"
  | "unsupported"
  | "need-install"
  | "idle" // supporté, pas encore activé
  | "enabled"
  | "blocked";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function RemindersCard() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;
      if (!supported) {
        // Sur iPhone, l'API n'existe que dans l'app installée depuis l'écran d'accueil.
        setState(isStandalone() ? "unsupported" : "need-install");
        return;
      }
      if (Notification.permission === "denied") {
        setState("blocked");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const existing = await reg.pushManager.getSubscription();
        setState(existing && Notification.permission === "granted" ? "enabled" : "idle");
      } catch {
        setState("idle");
      }
    })();
  }, []);

  async function enable() {
    setBusy(true);
    setMsg(null);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm === "denied" ? "blocked" : "idle");
        setBusy(false);
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) throw new Error("Clé publique manquante");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error("Enregistrement de l’abonnement échoué");
      setState("enabled");
      setMsg("Rappels activés sur cet appareil ✓");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur lors de l’activation");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setMsg(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("idle");
      setMsg("Rappels désactivés sur cet appareil.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Échec de l’envoi");
      setMsg(
        data.sent > 0
          ? `Notification envoyée à ${data.sent} appareil(s). Elle devrait arriver dans quelques secondes.`
          : "Aucun appareil abonné pour l’instant.",
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-5">
      <label className="mb-1 block text-sm font-medium text-ink">
        🔔 Rappels de cuisine
      </label>
      <p className="mb-3 text-xs text-ink-soft">
        Reçois une notification quand il est temps de commencer à cuisiner (selon
        l’heure des repas et le temps de préparation de la recette).
      </p>

      {state === "loading" && (
        <p className="text-sm text-ink-soft">Vérification…</p>
      )}

      {state === "need-install" && (
        <p className="rounded-lg bg-gold-soft/40 px-3 py-2 text-sm text-ink">
          📲 Sur iPhone/iPad, ouvre d’abord l’app <strong>depuis l’icône de
          l’écran d’accueil</strong> (Partager → « Sur l’écran d’accueil »), puis
          reviens ici pour activer les rappels.
        </p>
      )}

      {state === "unsupported" && (
        <p className="rounded-lg bg-brick/10 px-3 py-2 text-sm text-brick">
          Cet appareil ou ce navigateur ne prend pas en charge les notifications.
        </p>
      )}

      {state === "blocked" && (
        <p className="rounded-lg bg-brick/10 px-3 py-2 text-sm text-brick">
          Les notifications sont bloquées. Autorise-les dans les réglages de
          l’appareil pour cette app, puis reviens ici.
        </p>
      )}

      {state === "idle" && (
        <button
          onClick={enable}
          disabled={busy}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Activation…" : "Activer les rappels"}
        </button>
      )}

      {state === "enabled" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green/15 px-3 py-1.5 text-sm font-medium text-green">
            ✓ Activés sur cet appareil
          </span>
          <button
            onClick={test}
            disabled={busy}
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink hover:bg-parchment-deep disabled:opacity-60"
          >
            Envoyer une notif test
          </button>
          <button
            onClick={disable}
            disabled={busy}
            className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft hover:bg-parchment-deep disabled:opacity-60"
          >
            Désactiver
          </button>
        </div>
      )}

      {msg && <p className="mt-3 text-sm text-ink-soft">{msg}</p>}
    </Card>
  );
}
