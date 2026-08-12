"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/actions/settings";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

interface Initial {
  servings: number;
  allergies: string[];
  forbidden: string[];
  bgColor: string;
  cardColor: string;
  accentColor: string;
}

// Thèmes prédéfinis (fond / cartes / accent).
const PRESETS: { name: string; bg: string; card: string; accent: string }[] = [
  { name: "Parchemin", bg: "#f3efe4", card: "#faf7ef", accent: "#c9a227" },
  { name: "Menthe", bg: "#eaf2ec", card: "#f7fbf7", accent: "#4f6f52" },
  { name: "Ciel", bg: "#e9eff4", card: "#f6f9fc", accent: "#3f6f94" },
  { name: "Rosé", bg: "#f7ece9", card: "#fdf6f4", accent: "#b4502a" },
  { name: "Lavande", bg: "#efecf5", card: "#f9f7fc", accent: "#6b5b95" },
  { name: "Nuit", bg: "#26302c", card: "#33403a", accent: "#e7d9a6" },
];

const DEFAULTS = { bg: "#f3efe4", card: "#faf7ef", accent: "#c9a227" };

export function SettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [servings, setServings] = useState(String(initial.servings));
  const [allergies, setAllergies] = useState<string[]>(initial.allergies);
  const [forbidden, setForbidden] = useState<string[]>(initial.forbidden);
  const [bgColor, setBgColor] = useState(initial.bgColor || DEFAULTS.bg);
  const [cardColor, setCardColor] = useState(initial.cardColor || DEFAULTS.card);
  const [accentColor, setAccentColor] = useState(
    initial.accentColor || DEFAULTS.accent,
  );

  function applyPreset(p: (typeof PRESETS)[number]) {
    setBgColor(p.bg);
    setCardColor(p.card);
    setAccentColor(p.accent);
  }

  function save() {
    setSaved(false);
    startTransition(async () => {
      await saveSettings({
        servings,
        allergies,
        forbidden,
        bgColor,
        cardColor,
        accentColor,
      });
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <label className="mb-1 block text-sm font-medium text-ink">
          Nombre de personnes
        </label>
        <p className="mb-2 text-xs text-ink-soft">
          Utilisé par défaut pour les repas planifiés et les quantités.
        </p>
        <input
          type="number"
          min={1}
          max={50}
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          className="num w-28 rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </Card>

      <Card className="p-5">
        <TagEditor
          label="Allergies"
          hint="Ces ingrédients ne seront jamais planifiés ni proposés par l'IA."
          placeholder="ex : arachide, fruits de mer…"
          accent="brick"
          tags={allergies}
          onChange={setAllergies}
        />
      </Card>

      <Card className="p-5">
        <TagEditor
          label="Aliments interdits"
          hint="Aliments que la famille ne mange pas (jamais planifiés ni proposés)."
          placeholder="ex : porc, champignons…"
          accent="ink"
          tags={forbidden}
          onChange={setForbidden}
        />
      </Card>

      <Card className="p-5">
        <label className="mb-1 block text-sm font-medium text-ink">
          🎨 Couleurs de l’application
        </label>
        <p className="mb-3 text-xs text-ink-soft">
          Choisis une ambiance prête à l’emploi, ou personnalise chaque couleur.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-ink hover:bg-parchment-deep"
            >
              <span className="flex">
                <span
                  className="h-4 w-4 rounded-l-full border border-line"
                  style={{ background: p.bg }}
                />
                <span
                  className="h-4 w-4 rounded-r-full border border-l-0 border-line"
                  style={{ background: p.accent }}
                />
              </span>
              {p.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ColorField label="Fond" value={bgColor} onChange={setBgColor} />
          <ColorField label="Cartes / vignettes" value={cardColor} onChange={setCardColor} />
          <ColorField label="Accent (boutons)" value={accentColor} onChange={setAccentColor} />
        </div>
        <button
          type="button"
          onClick={() => applyPreset({ name: "", ...DEFAULTS })}
          className="mt-3 text-xs text-ink-soft underline hover:text-ink"
        >
          Réinitialiser les couleurs
        </button>
      </Card>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending}
          className="rounded-full bg-ink px-6 py-2.5 font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saved && !pending && (
          <span className="text-sm text-green">✓ Enregistré</span>
        )}
      </div>
    </div>
  );
}

function TagEditor({
  label,
  hint,
  placeholder,
  tags,
  onChange,
  accent,
}: {
  label: string;
  hint: string;
  placeholder: string;
  tags: string[];
  onChange: (t: string[]) => void;
  accent: "brick" | "ink";
}) {
  const [value, setValue] = useState("");
  function add() {
    const v = value.trim();
    if (v && !tags.some((t) => t.toLowerCase() === v.toLowerCase())) {
      onChange([...tags, v]);
    }
    setValue("");
  }
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <p className="mb-2 text-xs text-ink-soft">{hint}</p>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {tags.length === 0 && (
          <span className="text-sm text-ink-soft/70">Aucun</span>
        )}
        {tags.map((t) => (
          <span
            key={t}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm",
              accent === "brick"
                ? "border-brick/30 bg-brick/10 text-brick"
                : "border-line bg-parchment text-ink",
            )}
          >
            {t}
            <button
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="opacity-60 hover:opacity-100"
              aria-label={`Retirer ${t}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
        <button
          onClick={add}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-parchment-deep"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-line bg-parchment px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border border-line bg-transparent"
          aria-label={label}
        />
        <span className="num text-xs uppercase text-ink-soft">{value}</span>
      </div>
    </div>
  );
}
