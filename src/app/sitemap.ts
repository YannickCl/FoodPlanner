import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Plan du site : uniquement les pages publiques (vitrine). Les futures pages
// /guide/* et landing pages produit s'ajouteront ici au fil du contenu.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/guide/batch-cooking", priority: 0.9 },
    { path: "/tarifs", priority: 0.8 },
    { path: "/mentions-legales", priority: 0.3 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
