"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/duration";
import { cn } from "@/lib/cn";

export interface GuidedStep {
  recipe: string;
  text: string;
  phase: "prep" | "cook";
  durationMin: number | null;
  equipment: "four" | "plaque" | "aucun";
  type: "active" | "passive";
}

interface Timer {
  id: number;
  label: string;
  total: number;
  remaining: number;
  running: boolean;
  done: boolean;
}

export function BatchSession({ dishes, steps }: { dishes: string[]; steps: GuidedStep[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={steps.length === 0}
        className="w-full rounded-2xl bg-ink px-6 py-4 text-center text-lg font-semibold text-parchment shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        ▶ Lancer la session guidée
      </button>
      <p className="mt-2 text-center text-xs text-ink-soft">
        On t’accompagne pas à pas — une seule chose à faire à la fois.
      </p>
      {open && <Overlay dishes={dishes} steps={steps} onClose={() => setOpen(false)} />}
    </>
  );
}

function Overlay({
  dishes,
  steps,
  onClose,
}: {
  dishes: string[];
  steps: GuidedStep[];
  onClose: () => void;
}) {
  // -1 = écran d'intro ; steps.length = écran de fin.
  const [i, setI] = useState(-1);
  const [timers, setTimers] = useState<Timer[]>([]);
  const nextTimerId = useRef(1);
  const ringed = useRef<Set<number>>(new Set());
  const [wakeOn, setWakeOn] = useState(false);

  const last = steps.length - 1;
  const step = i >= 0 && i <= last ? steps[i] : null;

  const next = useCallback(() => setI((v) => Math.min(steps.length, v + 1)), [steps.length]);
  const prev = useCallback(() => setI((v) => Math.max(-1, v - 1)), []);

  // Écran maintenu allumé pendant la session.
  useEffect(() => {
    let sentinel: WakeLockSentinel | null = null;
    const request = async () => {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          sentinel = await navigator.wakeLock.request("screen");
          setWakeOn(true);
          sentinel.addEventListener("release", () => setWakeOn(false));
        }
      } catch {
        setWakeOn(false);
      }
    };
    request();
    const onVis = () => {
      if (document.visibilityState === "visible") request();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      sentinel?.release().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  // Décompte des minuteurs.
  useEffect(() => {
    if (!timers.some((t) => t.running && t.remaining > 0)) return;
    const id = setInterval(() => {
      setTimers((list) =>
        list.map((t) =>
          !t.running || t.remaining <= 0
            ? t
            : t.remaining - 1 <= 0
              ? { ...t, remaining: 0, running: false, done: true }
              : { ...t, remaining: t.remaining - 1 },
        ),
      );
    }, 1000);
    return () => clearInterval(id);
  }, [timers]);

  useEffect(() => {
    for (const t of timers) {
      if (t.done && !ringed.current.has(t.id)) {
        ringed.current.add(t.id);
        ring();
      }
    }
  }, [timers]);

  function startTimer(label: string, min: number) {
    const id = nextTimerId.current++;
    setTimers((l) => [
      ...l,
      { id, label, total: min * 60, remaining: min * 60, running: true, done: false },
    ]);
  }
  function closeTimer(id: number) {
    ringed.current.delete(id);
    setTimers((l) => l.filter((t) => t.id !== id));
  }

  // Swipe
  const touchX = useRef<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-parchment text-ink">
      {/* Barre du haut */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:bg-parchment-deep"
        >
          ✕ Quitter
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-display text-lg leading-none">Session batch</p>
          <p className="num mt-0.5 text-xs text-ink-soft">
            {i < 0 ? "Prêt ?" : i >= steps.length ? "Terminé" : `Étape ${i + 1} / ${steps.length}`}
            {wakeOn && <span className="ml-1">· 🔆</span>}
          </p>
        </div>
        <span className="num text-xs text-ink-soft">{dishes.length} plats</span>
      </div>

      {/* Progression */}
      {i >= 0 && i < steps.length && (
        <div className="flex gap-1 px-4 pt-3">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                idx < i ? "bg-gold/60" : idx === i ? "bg-gold" : "bg-line",
              )}
            />
          ))}
        </div>
      )}

      {/* Contenu */}
      <div
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6 text-center"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx < -50) next();
          else if (dx > 50) prev();
          touchX.current = null;
        }}
      >
        {/* Intro */}
        {i < 0 && (
          <div className="max-w-md">
            <p className="mb-4 text-6xl">🍱</p>
            <h2 className="mb-3 font-display text-3xl">On cuisine {dishes.length} plats ensemble</h2>
            <p className="mb-2 text-ink-soft">
              Pas de panique : on y va <strong>une étape à la fois</strong>. D’abord on
              prépare tout tranquillement, puis on lance les cuissons — les plus
              longues d’abord.
            </p>
            <p className="text-sm text-ink-soft">
              L’écran reste allumé, et tu peux lancer un minuteur à chaque cuisson.
            </p>
          </div>
        )}

        {/* Étape */}
        {step && (
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  step.phase === "prep" ? "bg-gold-soft text-ink" : "bg-brick/15 text-brick",
                )}
              >
                {step.phase === "prep" ? "1 · Mise en place" : "2 · Cuisson"}
              </span>
              <span className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft">
                Pour : {step.recipe}
              </span>
            </div>
            <p className="font-display text-2xl leading-snug sm:text-3xl md:text-4xl">
              {step.text}
            </p>
            {step.durationMin !== null && (
              <div className="mt-6">
                <button
                  onClick={() => startTimer(`${step.recipe} · ${step.durationMin} min`, step.durationMin!)}
                  className="rounded-full bg-brick px-5 py-2.5 text-base font-medium text-parchment shadow-sm hover:opacity-90"
                >
                  ⏱ Lancer le minuteur ({step.durationMin} min)
                </button>
                {step.type === "passive" && (
                  <p className="mt-3 text-sm text-ink-soft">
                    💡 Lance le minuteur, puis passe à l’étape suivante — ça cuit tout seul
                    pendant ce temps.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Fin */}
        {i >= steps.length && (
          <div className="max-w-md">
            <p className="mb-4 text-6xl">🎉</p>
            <h2 className="mb-3 font-display text-3xl">Bravo, c’est bouclé !</h2>
            <p className="text-ink-soft">
              Tes plats sont prêts ou en train de cuire. Profite des dernières minutes
              de cuisson pour ranger la cuisine. 🧽
            </p>
          </div>
        )}
      </div>

      {/* Minuteurs actifs */}
      {timers.length > 0 && (
        <div className="max-h-40 divide-y divide-line overflow-y-auto border-t border-line">
          {timers.map((t) => (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5",
                t.done ? "bg-brick/15" : "bg-parchment-card",
              )}
            >
              <span className={cn("text-2xl", t.done && "animate-pulse")}>
                {t.done ? "🔔" : "⏱"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="num text-xl font-semibold leading-none tabular-nums">
                  {formatClock(t.remaining)}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-soft">
                  {t.done ? "⏰ Terminé — " : ""}
                  {t.label}
                </p>
              </div>
              <button
                onClick={() => closeTimer(t.id)}
                className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-parchment-deep"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 border-t border-line px-4 py-4">
        <button
          onClick={prev}
          disabled={i < 0}
          className="rounded-full border border-line px-6 py-3 text-base font-medium hover:bg-parchment-deep disabled:opacity-30"
        >
          ← Précédent
        </button>
        {i < 0 ? (
          <button
            onClick={next}
            className="flex-1 rounded-full bg-ink px-6 py-3 text-base font-semibold text-parchment hover:opacity-90"
          >
            Commencer →
          </button>
        ) : i < steps.length ? (
          <button
            onClick={next}
            className="flex-1 rounded-full bg-ink px-6 py-3 text-base font-semibold text-parchment hover:opacity-90"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-green px-6 py-3 text-base font-semibold text-parchment hover:opacity-90"
          >
            ✓ Terminer
          </button>
        )}
      </div>
    </div>
  );
}

function ring() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const beep = (start: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.35);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + 0.36);
    };
    beep(0);
    beep(0.45);
    beep(0.9);
    setTimeout(() => ctx.close().catch(() => {}), 1600);
  } catch {
    /* audio indisponible */
  }
  try {
    navigator.vibrate?.([300, 150, 300]);
  } catch {
    /* vibration indisponible */
  }
}
