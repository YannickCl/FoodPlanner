import type { Category } from "@/generated/prisma/enums";

// Une couleur par catégorie, déclinée en badge / barre d'accent / fond teinté,
// pour un rendu plus coloré et joyeux (cartes recettes, cases calendrier…).
export const CATEGORY_STYLE: Record<
  Category,
  { badge: string; accent: string; tint: string; emoji: string }
> = {
  FAVORI: {
    badge: "bg-gold-soft text-ink border-gold/40",
    accent: "border-l-gold",
    tint: "bg-gold-soft/50",
    emoji: "⭐️",
  },
  RAPIDE: {
    badge: "bg-blue-soft text-blue border-blue/30",
    accent: "border-l-blue",
    tint: "bg-blue-soft/60",
    emoji: "⚡️",
  },
  HEALTHY: {
    badge: "bg-green/12 text-green border-green/30",
    accent: "border-l-green",
    tint: "bg-green/10",
    emoji: "🥗",
  },
  SALADE_ETE: {
    badge: "bg-teal-soft text-teal border-teal/30",
    accent: "border-l-teal",
    tint: "bg-teal-soft/60",
    emoji: "🌞",
  },
  SOUPE_HIVER: {
    badge: "bg-brick/12 text-brick border-brick/30",
    accent: "border-l-brick",
    tint: "bg-brick/10",
    emoji: "🍲",
  },
};
