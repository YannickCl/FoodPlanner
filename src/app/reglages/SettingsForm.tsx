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
}

export function SettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [servings, setServings] = useState(String(initial.servings));
  const [allergies, setAllergies] = useState<string[]>(initial.allergies);
  const [forbidden, setForbidden] = useState<string[]>(initial.forbidden);

  function save() {
    setSaved(false);
    startTransition(async () => {
      await saveSettings({
        servings,
        allergies,
        forbidden,
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
