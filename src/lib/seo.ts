// Configuration SEO centralisée.
// Le domaine et l'ouverture à l'indexation passent par des variables
// d'environnement : rien n'est figé avant le lancement (nom + domaine + légal).

/** Origine canonique du site, sans slash final (ex. https://menoo.fr). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Ouvre la vitrine à l'indexation Google.
 * FALSE par défaut = mode furtif pré-lancement (rien n'est indexé).
 * À passer à "true" via NEXT_PUBLIC_SEO_INDEX le jour du lancement public,
 * quand le nom définitif, le domaine et les mentions légales sont prêts.
 */
export const SEO_INDEXABLE = process.env.NEXT_PUBLIC_SEO_INDEX === "true";

/** Métadonnée `robots` appliquée aux pages PUBLIQUES (groupe (marketing)). */
export const publicRobots = SEO_INDEXABLE
  ? { index: true, follow: true }
  : { index: false, follow: false };

/** Chemins privés (application + tunnels d'auth) à ne jamais indexer. */
export const PRIVATE_PATHS = [
  "/calendrier",
  "/courses",
  "/recettes",
  "/reglages",
  "/batch",
  "/onboarding",
  "/login",
  "/signup",
  "/reset",
  "/rejoindre",
  "/api",
];
