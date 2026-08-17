import type { MetadataRoute } from "next";
import { SITE_URL, SEO_INDEXABLE, PRIVATE_PATHS } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Pré-lancement (NEXT_PUBLIC_SEO_INDEX ≠ "true") : on bloque tout.
  if (!SEO_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  // Lancement : vitrine explorable, application privée exclue.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
