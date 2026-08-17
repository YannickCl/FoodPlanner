"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Season } from "@/generated/prisma/enums";
import { CATEGORY_LABELS } from "@/lib/labels";
import { stripAccents } from "@/lib/normalize";
import { CategoryBadge, StarchBadge, SeasonBadge } from "@/components/ui";
import { CATEGORY_STYLE } from "@/lib/category-style";
import { cn } from "@/lib/cn";

interface RecipeRow {
  id: string;
  name: string;
  category: Category;
  prepTime: string;
  containsStarch: boolean;
  season: Season;
  isFavorite: boolean;
  ingredientCount: number;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function RecipesBrowser({ recipes }: { recipes: RecipeRow[] }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category | null>(null);
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = stripAccents(search);
    return recipes.filter((r) => {
      if (favOnly && !r.isFavorite) return false;
      if (cat && r.category !== cat) return false;
      if (q && !stripAccents(r.name).includes(q)) return false;
      return true;
    });
  }, [recipes, search, cat, favOnly]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une recette…"
          className="w-full rounded-lg border border-line bg-parchment-card px-4 py-2.5 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
        <div className="flex flex-wrap gap-2">
          <Chip active={cat === null && !favOnly} onClick={() => { setCat(null); setFavOnly(false); }}>
            Toutes
          </Chip>
          <Chip active={favOnly} onClick={() => { setFavOnly((v) => !v); setCat(null); }}>
            ★ Favoris
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={cat === c}
              onClick={() => {
                setCat(c);
                setFavOnly(false);
              }}
            >
              {CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Aucune recette trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <Link key={r.id} href={`/recettes/${r.id}`}>
              <div
                style={{ animationDelay: `${Math.min(i, 14) * 35}ms` }}
                className={cn(
                  "rise flex h-full flex-col gap-3 rounded-[14px] border border-l-4 border-line p-4 shadow-[0_1px_0_rgba(30,43,35,0.04),0_8px_24px_rgba(30,43,35,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(30,43,35,0.13)]",
                  CATEGORY_STYLE[r.category].accent,
                  CATEGORY_STYLE[r.category].tint,
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl leading-none" aria-hidden>
                    {CATEGORY_STYLE[r.category].emoji}
                  </span>
                  <h3 className="flex-1 text-lg leading-tight text-ink">
                    {r.name}
                  </h3>
                  {r.isFavorite && (
                    <span className="text-gold" title="Favori" aria-label="Favori">
                      ★
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <CategoryBadge category={r.category} />
                  <StarchBadge contains={r.containsStarch} />
                  <SeasonBadge season={r.season} />
                </div>
                <div className="mt-auto flex items-center gap-3 text-xs text-ink-soft">
                  <span className="num">{r.prepTime}</span>
                  <span>·</span>
                  <span>
                    <span className="num">{r.ingredientCount}</span> ingrédients
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-ink bg-ink text-parchment"
          : "border-line bg-parchment-card text-ink-soft hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
