"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleCheck } from "@/app/actions/shopping";
import { type ShoppingList } from "@/lib/shopping";
import { formatLong, weekRange, monthRangeOf } from "@/lib/dates";
import { cn } from "@/lib/cn";

export function ShoppingClient({
  from,
  to,
  today,
  list,
  checkedKeys,
  recipeCount,
}: {
  from: string;
  to: string;
  today: string;
  list: ShoppingList;
  checkedKeys: string[];
  recipeCount: number;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(new Set(checkedKeys));

  function setRange(f: string, t: string) {
    router.push(`/courses?from=${f}&to=${t}`);
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
            <h1 className="text-3xl text-ink">Liste de courses</h1>
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

      <div className="print-area mx-auto max-w-md">
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

          <div className="mt-4 border-t border-dashed border-ink/20 pt-3 text-center">
            <p className="num text-xs text-ink-soft">
              {list.itemCount} article{list.itemCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="ticket-edge rotate-180" />
      </div>
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
