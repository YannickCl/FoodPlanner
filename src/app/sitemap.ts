import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Plan du site : uniquement les pages publiques (vitrine). Les futures pages
// /guide/* et landing pages produit s'ajouteront ici au fil du contenu.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/guide", priority: 0.8 },
    { path: "/planning-repas", priority: 0.9 },
    { path: "/liste-de-courses", priority: 0.9 },
    { path: "/batch-cooking", priority: 0.9 },
    { path: "/guide/menu-de-la-semaine", priority: 0.9 },
    { path: "/guide/charge-mentale-repas", priority: 0.9 },
    { path: "/guide/batch-cooking", priority: 0.9 },
    { path: "/guide/menu-batch-cooking-semaine", priority: 0.8 },
    { path: "/guide/semainier-a-imprimer", priority: 0.8 },
    { path: "/guide/idees-repas-semaine", priority: 0.8 },
    { path: "/guide/recettes-qui-se-congelent", priority: 0.8 },
    { path: "/guide/menu-equilibre-semaine", priority: 0.8 },
    { path: "/guide/menu-semaine-pas-cher", priority: 0.8 },
    { path: "/guide/organisation-repas-rentree", priority: 0.8 },
    { path: "/guide/que-manger-ce-soir", priority: 0.8 },
    { path: "/comparatif/jow", priority: 0.7 },
    { path: "/tarifs", priority: 0.8 },
    { path: "/mentions-legales", priority: 0.3 },
    { path: "/confidentialite", priority: 0.3 },
    { path: "/cgu", priority: 0.3 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
