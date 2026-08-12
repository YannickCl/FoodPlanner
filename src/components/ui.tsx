import type { Category, Season } from "@/generated/prisma/enums";
import { CATEGORY_LABELS, SEASON_LABELS } from "@/lib/labels";
import { CATEGORY_STYLE } from "@/lib/category-style";
import { cn } from "@/lib/cn";

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        CATEGORY_STYLE[category].badge,
      )}
    >
      <span aria-hidden>{CATEGORY_STYLE[category].emoji}</span>
      {CATEGORY_LABELS[category]}
    </span>
  );
}

export function StarchBadge({ contains }: { contains: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        contains
          ? "border-brick/30 bg-brick/10 text-brick"
          : "border-green/30 bg-green/10 text-green",
      )}
      title={contains ? "Contient un féculent (déjeuner)" : "Léger (peut aller le soir)"}
    >
      {contains ? "Féculent" : "Léger"}
    </span>
  );
}

export function SeasonBadge({ season }: { season: Season }) {
  if (season === "ALL") return null;
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-parchment px-2 py-0.5 text-xs font-medium text-ink-soft">
      {SEASON_LABELS[season]}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-line bg-parchment-card shadow-[0_1px_0_rgba(30,43,35,0.04),0_8px_24px_rgba(30,43,35,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
