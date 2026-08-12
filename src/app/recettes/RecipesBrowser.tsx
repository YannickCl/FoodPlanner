"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Season } from "@/generated/prisma/enums";
import { CATEGORY_LABELS } from "@/lib/labels";
import { stripAccents } from "@/lib/normalize";
import { CategoryBadge, StarchBadge, SeasonBadge, Card } from "@/components/ui";
import { cn } from "@/lib/cn";

interface RecipeRow {
  id: string;
  name: string;
  category: Category;
  prepTime: string;
  containsStarch: boolean;
  season: Season;
  ingredientCount: number;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function RecipesBrowser({ recipes }: { recipes: RecipeRow[] }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const q = stripAccents(search);
    return recipes.filter((r) => {
      if (cat && r.category !== cat) return false;
      if (q && !stripAccents(r.name).includes(q)) return false;
      return true;
    });
  }, [recipes, search, cat]);

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
          <Chip active={cat === null} onClick={() => setCat(null)}>
            Toutes
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Aucune recette trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link key={r.id} href={`/recettes/${r.id}`}>
              <Card className="flex h-full flex-col gap-3 p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg leading-tight text-ink">{r.name}</h3>
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
              </Card>
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
