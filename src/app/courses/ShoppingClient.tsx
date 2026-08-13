"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  toggleCheck,
  addExtra,
  toggleExtra,
  deleteExtra,
} from "@/app/actions/shopping";
import { type ShoppingList } from "@/lib/shopping";
import { formatLong, weekRange, monthRangeOf } from "@/lib/dates";
import { AISLE_EMOJI } from "@/lib/labels";
import { cn } from "@/lib/cn";

interface RecipeBreakdown {
  name: string;
  items: { name: string; qtyLabel: string }[];
}

interface Extra {
  id: string;
  name: string;
  checked: boolean;
}

export function ShoppingClient({
  from,
  to,
  today,
  list,
  checkedKeys,
  recipeCount,
  recipeBreakdown,
  extras,
}: {
  from: string;
  to: string;
  today: string;
  list: ShoppingList;
  checkedKeys: string[];
  recipeCount: number;
  recipeBreakdown: RecipeBreakdown[];
  extras: Extra[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [checked, setChecked] = useState<Set<string>>(new Set(checkedKeys));
  const [items, setItems] = useState<Extra[]>(extras);
  const [newItem, setNewItem] = useState("");

  function addItem() {
    const name = newItem.trim();
    if (!name) return;
    setNewItem("");
    addExtra({ rangeStart: from, rangeEnd: to, name }).then((res) => {
      if (res?.id) setItems((l) => [...l, { id: res.id, name, checked: false }]);
    });
  }
  function toggleItem(id: string) {
    setItems((l) =>
      l.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)),
    );
    const it = items.find((x) => x.id === id);
    void toggleExtra({ id, checked: !it?.checked });
  }
  function removeItem(id: string) {
    setItems((l) => l.filter((it) => it.id !== id));
    void deleteExtra({ id });
  }

  function setRange(f: string, t: string) {
    startTransition(() => router.push(`/courses?from=${f}&to=${t}`));
  }

  function toggle(key: string) {
    const next = new Set(checked);
    const value = !next.has(key);
    if (value) next.add(key);
    else next.delete(key);
    setChecked(next);
    void toggleCheck({
      rangeStart: from,
      rangeEnd: to,
      ingredientKey: key,
      checked: value,
    });
  }

  const week = weekRange(today);
  const month = monthRangeOf(today);
  const isWeek = from === week.from && to === week.to;
  const isMonth = from === month.from && to === month.to;

  return (
    <div>
      <div className="no-print mb-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-1">Prêt pour le magasin</p>
            <h1 className="text-4xl text-ink">Liste de courses</h1>
            <p className="mt-1 text-sm text-ink-soft">
              <span className="num">{recipeCount}</span> repas ·{" "}
              <span className="num">{list.itemCount}</span> articles
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-full border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-parchment"
          >
            🖨 Imprimer
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRange(week.from, week.to)}
            className={rangeBtn(isWeek)}
          >
            Cette semaine
          </button>
          <button
            onClick={() => setRange(month.from, month.to)}
            className={rangeBtn(isMonth)}
          >
            Ce mois
          </button>
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-parchment-card px-3 py-1.5">
            <input
              type="date"
              value={from}
              onChange={(e) => setRange(e.target.value, to)}
              className="num bg-transparent text-sm text-ink outline-none"
            />
            <span className="text-ink-soft">→</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setRange(from, e.target.value)}
              className="num bg-transparent text-sm text-ink outline-none"
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "print-area mx-auto max-w-md transition-opacity",
          pending && "pointer-events-none opacity-50",
        )}
      >
        <div className="ticket-edge" />
        <div className="ticket px-5 py-4">
          <div className="mb-3 border-b border-dashed border-ink/20 pb-3 text-center">
            <p className="font-display text-lg text-ink">Food Planner</p>
            <p className="num text-xs text-ink-soft">
              {formatLong(from)} → {formatLong(to)}
            </p>
          </div>

          {list.groups.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">
              Aucun repas planifié sur cette période.
            </p>
          ) : (
            <div className="space-y-4">
              {list.groups.map((group) => (
                <div key={group.aisle}>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
                    <span aria-hidden className="mr-1">
                      {AISLE_EMOJI[group.aisle]}
                    </span>
                    {group.label}
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const isChecked = checked.has(item.key);
                      return (
                        <li key={item.key}>
                          <label className="flex cursor-pointer items-baseline gap-2 py-0.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggle(item.key)}
                              className="no-print mt-1 h-4 w-4 shrink-0 accent-green"
                            />
                            <span
                              className={cn(
                                "flex-1 text-sm leading-snug",
                                isChecked
                                  ? "text-ink-soft line-through"
                                  : "text-ink",
                              )}
                            >
                              {item.qtyLabel && (
                                <span className="num font-medium">
                                  {item.qtyLabel}{" "}
                                </span>
                              )}
                              {item.name}
                              {item.notes.length > 0 && (
                                <span className="text-ink-soft">
                                  {" "}
                                  ({item.notes.join(", ")})
                                </span>
                              )}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brick">
              🧺 Autres articles
            </p>
            <ul className="space-y-0.5">
              {items.map((it) => (
                <li key={it.id} className="flex items-baseline gap-2 py-0.5">
                  <input
                    type="checkbox"
                    checked={it.checked}
                    onChange={() => toggleItem(it.id)}
                    className="no-print mt-1 h-4 w-4 shrink-0 accent-green"
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm leading-snug",
                      it.checked ? "text-ink-soft line-through" : "text-ink",
                    )}
                  >
                    {it.name}
                  </span>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="no-print text-ink-soft hover:text-brick"
                    aria-label="Retirer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="no-print mt-2 flex gap-2">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem();
                  }
                }}
                placeholder="Piles, gel douche, sacs poubelle…"
                className="flex-1 rounded-lg border border-line bg-parchment px-3 py-1.5 text-sm text-ink outline-none focus:border-gold"
              />
              <button
                onClick={addItem}
                className="rounded-lg bg-green px-3 py-1.5 text-sm font-medium text-parchment"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="mt-4 border-t border-dashed border-ink/20 pt-3 text-center">
            <p className="num text-xs text-ink-soft">
              {list.itemCount + items.length} article
              {list.itemCount + items.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="ticket-edge rotate-180" />
      </div>

      {recipeBreakdown.length > 0 && (
        <details className="mx-auto mt-6 max-w-md rounded-[var(--radius-card)] border border-line bg-parchment-card p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink">
            Détail par recette
          </summary>
          <p className="mt-1 text-xs text-ink-soft">
            Les ingrédients regroupés sous chaque plat (certains se répètent avec
            la liste ci-dessus).
          </p>
          <div className="mt-3 space-y-4">
            {recipeBreakdown.map((r) => (
              <div key={r.name}>
                <p className="mb-1 font-display text-base text-ink">{r.name}</p>
                <ul className="space-y-0.5">
                  {r.items.map((it, i) => (
                    <li key={i} className="text-sm text-ink">
                      {it.qtyLabel && (
                        <span className="num font-medium">{it.qtyLabel} </span>
                      )}
                      {it.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function rangeBtn(active: boolean): string {
  return cn(
    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "border-ink bg-ink text-parchment"
      : "border-line bg-parchment-card text-ink-soft hover:text-ink",
  );
}
