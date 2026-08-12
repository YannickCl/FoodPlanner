"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { findDurations, formatClock, type StepDuration } from "@/lib/duration";
import { cn } from "@/lib/cn";

interface Props {
  recipeId: string;
  name: string;
  prepTime: string;
  steps: string[];
  ingredients: string[];
}

interface Timer {
  id: number;
  label: string; // durée telle qu'écrite ("10 min")
  stepIndex: number; // étape d'où vient le minuteur
  excerpt: string; // texte de l'étape, pour savoir de quoi il s'agit (riz, légumes…)
  total: number;
  remaining: number;
  running: boolean;
  done: boolean;
}

export function CookMode({ recipeId, name, prepTime, steps, ingredients }: Props) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [showIng, setShowIng] = useState(false);
  const [timers, setTimers] = useState<Timer[]>([]);
  const nextTimerId = useRef(1);
  const ringed = useRef<Set<number>>(new Set());
  const [needRotate, setNeedRotate] = useState(false);

  const last = steps.length - 1;
  const step = steps[i] ?? "";
  const durations = findDurations(step);

  const next = useCallback(() => setI((v) => Math.min(last, v + 1)), [last]);
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    router.push(`/recettes/${recipeId}`);
  }, [router, recipeId]);

  // --- Orientation : on invite à passer en paysage sur petit écran ---
  useEffect(() => {
    const check = () => {
      const small = window.matchMedia("(max-width: 1024px)").matches;
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      setNeedRotate(small && portrait);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  // --- Clavier : flèches + échap ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, close]);

  // --- Décompte : fait avancer tous les minuteurs en cours à la fois ---
  useEffect(() => {
    if (!timers.some((t) => t.running && t.remaining > 0)) return;
    const id = setInterval(() => {
      setTimers((list) =>
        list.map((t) => {
          if (!t.running || t.remaining <= 0) return t;
          const remaining = t.remaining - 1;
          return remaining <= 0
            ? { ...t, remaining: 0, running: false, done: true }
            : { ...t, remaining };
        }),
      );
    }, 1000);
    return () => clearInterval(id);
  }, [timers]);

  // --- Sonnerie : une seule fois par minuteur arrivé à zéro ---
  useEffect(() => {
    for (const t of timers) {
      if (t.done && !ringed.current.has(t.id)) {
        ringed.current.add(t.id);
        ring();
      }
    }
  }, [timers]);

  function startTimer(d: StepDuration) {
    const id = nextTimerId.current++;
    setTimers((list) => [
      ...list,
      {
        id,
        label: d.label,
        stepIndex: i,
        excerpt: step,
        total: d.seconds,
        remaining: d.seconds,
        running: true,
        done: false,
      },
    ]);
  }

  function toggleTimer(id: number) {
    setTimers((list) =>
      list.map((t) => (t.id === id && !t.done ? { ...t, running: !t.running } : t)),
    );
  }
  function resetTimer(id: number) {
    ringed.current.delete(id);
    setTimers((list) =>
      list.map((t) =>
        t.id === id ? { ...t, remaining: t.total, running: true, done: false } : t,
      ),
    );
  }
  function closeTimer(id: number) {
    ringed.current.delete(id);
    setTimers((list) => list.filter((t) => t.id !== id));
  }

  async function goFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        const orient = (screen as unknown as { orientation?: { lock?: (o: string) => Promise<void> } }).orientation;
        await orient?.lock?.("landscape");
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* best effort — certains navigateurs refusent */
    }
  }

  // --- Swipe (mobile) ---
  const touchX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
    touchX.current = null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-parchment text-ink">
      {/* Barre du haut */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <button
          onClick={close}
          className="rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:bg-parchment-deep"
        >
          ✕ Quitter
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-display text-lg leading-none">{name}</p>
          <p className="num mt-0.5 text-xs text-ink-soft">
            Étape {i + 1} / {steps.length} · {prepTime}
          </p>
        </div>
        <button
          onClick={() => setShowIng(true)}
          className="rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:bg-parchment-deep"
        >
          🧺
        </button>
        <button
          onClick={goFullscreen}
          className="hidden rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:bg-parchment-deep sm:block"
          title="Plein écran"
        >
          ⛶
        </button>
      </div>

      {/* Progression */}
      <div className="flex gap-1 px-4 pt-3">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              idx < i ? "bg-gold/60" : idx === i ? "bg-gold" : "bg-line",
            )}
          />
        ))}
      </div>

      {/* Étape courante */}
      <div
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6 text-center"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <span className="num mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-2xl font-semibold text-ink">
          {i + 1}
        </span>
        <p className="max-w-3xl font-display text-2xl leading-snug sm:text-3xl md:text-4xl">
          {step}
        </p>

        {durations.length > 0 && (
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {durations.map((d, k) => (
              <button
                key={k}
                onClick={() => startTimer(d)}
                className="rounded-full bg-brick px-5 py-2.5 text-base font-medium text-parchment shadow-sm transition-transform hover:opacity-90"
              >
                ⏱ Minuteur {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Minuteurs actifs — plusieurs à la fois (ex : riz + légumes) */}
      {timers.length > 0 && (
        <div className="max-h-44 divide-y divide-line overflow-y-auto border-t border-line">
          {timers.map((t) => (
            <TimerBar
              key={t.id}
              timer={t}
              onToggle={() => toggleTimer(t.id)}
              onReset={() => resetTimer(t.id)}
              onClose={() => closeTimer(t.id)}
            />
          ))}
        </div>
      )}

      {/* Navigation bas */}
      <div className="flex items-center gap-3 border-t border-line px-4 py-4">
        <button
          onClick={prev}
          disabled={i === 0}
          className="rounded-full border border-line px-6 py-3 text-base font-medium hover:bg-parchment-deep disabled:opacity-30"
        >
          ← Précédent
        </button>
        {i < last ? (
          <button
            onClick={next}
            className="flex-1 rounded-full bg-ink px-6 py-3 text-base font-semibold text-parchment hover:opacity-90"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={close}
            className="flex-1 rounded-full bg-green px-6 py-3 text-base font-semibold text-parchment hover:opacity-90"
          >
            ✓ Terminé, bon appétit !
          </button>
        )}
      </div>

      {/* Panneau ingrédients */}
      {showIng && (
        <div
          className="absolute inset-0 z-10 flex flex-col bg-parchment/98 backdrop-blur"
          onClick={() => setShowIng(false)}
        >
          <div
            className="mx-auto mt-16 w-full max-w-md px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">🧺 Ingrédients</h2>
              <button
                onClick={() => setShowIng(false)}
                className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-parchment-deep"
              >
                Fermer
              </button>
            </div>
            <ul className="space-y-1.5">
              {ingredients.map((line, k) => (
                <li key={k} className="border-b border-line/60 pb-1.5 text-ink">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Invitation à tourner l'appareil */}
      {needRotate && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-parchment px-8 text-center">
          <span className="animate-pulse text-6xl">🔄</span>
          <p className="font-display text-2xl">Tournez votre appareil</p>
          <p className="max-w-xs text-sm text-ink-soft">
            Le mode cuisine se savoure en paysage — plus de place pour les étapes
            et les minuteurs.
          </p>
        </div>
      )}
    </div>
  );
}

function TimerBar({
  timer,
  onToggle,
  onReset,
  onClose,
}: {
  timer: Timer;
  onToggle: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5",
        timer.done ? "bg-brick/15" : "bg-parchment-card",
      )}
    >
      <span className={cn("text-2xl", timer.done && "animate-pulse")}>
        {timer.done ? "🔔" : "⏱"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="num text-xl font-semibold leading-none tabular-nums">
            {formatClock(timer.remaining)}
          </p>
          <span className="shrink-0 rounded-full bg-gold-soft px-1.5 py-0.5 text-[11px] font-medium text-ink">
            Étape {timer.stepIndex + 1}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-soft">
          {timer.done ? "⏰ Terminé — " : ""}
          {timer.excerpt}
        </p>
      </div>
      {!timer.done && (
        <button
          onClick={onToggle}
          className="rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:bg-parchment-deep"
        >
          {timer.running ? "Pause" : "Reprendre"}
        </button>
      )}
      <button
        onClick={onReset}
        className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-parchment-deep"
        title="Recommencer"
      >
        ↺
      </button>
      <button
        onClick={onClose}
        className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-parchment-deep"
        title="Fermer"
      >
        ✕
      </button>
    </div>
  );
}

// Sonnerie de fin de minuteur : bip sonore + vibration.
function ring() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
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
    navigator.vibrate?.([300, 150, 300, 150, 300]);
  } catch {
    /* vibration indisponible */
  }
}
