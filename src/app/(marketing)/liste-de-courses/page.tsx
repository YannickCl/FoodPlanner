import type { Metadata } from "next";
import { FeatureLanding, type FeatureLandingData } from "../_components/FeatureLanding";

const PATH = "/liste-de-courses";
const TITLE = "Liste de courses automatique pour la famille";
const DESCRIPTION =
  "Une liste de courses générée automatiquement depuis vos repas planifiés : rangée par rayon, doublons fusionnés, articles du quotidien ajoutés. Fini les oublis et les allers-retours au magasin.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", url: PATH, title: TITLE, description: DESCRIPTION },
};

const DATA: FeatureLandingData = {
  eyebrow: "Liste de courses",
  title: "La liste de courses, générée toute seule",
  intro:
    "Plus besoin de tout noter à la main : votre liste se construit à partir des repas de la semaine, prête pour le magasin.",
  canonicalPath: PATH,
  bullets: [
    { emoji: "🧾", title: "Générée depuis vos repas", text: "Chaque plat planifié ajoute ses ingrédients à la liste, avec les bonnes quantités selon le nombre de convives." },
    { emoji: "🗂️", title: "Rangée par rayon", text: "Fruits et légumes, épicerie, crémerie… tout est trié pour un parcours de magasin efficace." },
    { emoji: "➕", title: "Doublons fusionnés", text: "Deux recettes qui utilisent des oignons ? Une seule ligne, quantités additionnées. Vous ajoutez aussi vos articles du quotidien." },
    { emoji: "✅", title: "À cocher en magasin", text: "Cochez au fur et à mesure depuis votre téléphone. Les basiques (sel, huile…) sont exclus automatiquement." },
  ],
  steps: [
    { title: "Planifiez vos repas", text: "Remplissez le calendrier de la semaine avec vos recettes." },
    { title: "La liste se construit", text: "Les ingrédients s'agrègent automatiquement, triés par rayon et dédoublonnés." },
    { title: "Faites vos courses", text: "Ouvrez la liste sur votre téléphone et cochez au fil du magasin." },
  ],
  related: [
    { href: "/planning-repas", label: "Le planning des repas" },
    { href: "/batch-cooking", label: "Le batch cooking guidé" },
    { href: "/guide/menu-batch-cooking-semaine", label: "Un menu d'une semaine avec sa liste" },
  ],
  faq: [
    { q: "Les quantités s'adaptent-elles au nombre de personnes ?", a: "Oui. Les quantités sont calculées selon le nombre de convives défini pour votre foyer et pour chaque repas." },
    { q: "Peut-on ajouter des articles hors recettes ?", a: "Oui. Vous ajoutez librement vos produits du quotidien (café, lessive, etc.) ; ils apparaissent dans la liste avec le reste." },
    { q: "Les ingrédients de base sont-ils inclus ?", a: "Les basiques comme le sel, le poivre ou l'huile sont exclus par défaut pour ne pas encombrer la liste." },
  ],
};

export default function ListeDeCoursesPage() {
  return <FeatureLanding {...DATA} />;
}
