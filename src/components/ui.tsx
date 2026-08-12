import type { Category, Season } from "@/generated/prisma/enums";
import { CATEGORY_LABELS, SEASON_LABELS } from "@/lib/labels";
import { cn } from "@/lib/cn";

const CATEGORY_STYLES: Record<Category, string> = {
  FAVORI: "bg-gold-soft text-ink border-gold/40",
  RAPIDE: "bg-green/12 text-green border-green/30",
  HEALTHY: "bg-green/10 text-green border-green/25",
  SALADE_ETE: "bg-green/15 text-green border-green/30",
  SOUPE_HIVER: "bg-brick/12 text-brick border-brick/30",
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        CATEGORY_STYLES[category],
      )}
    >
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
