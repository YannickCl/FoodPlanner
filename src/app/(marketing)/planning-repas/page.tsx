import type { Metadata } from "next";
import { FeatureLanding, type FeatureLandingData } from "../_components/FeatureLanding";

const PATH = "/planning-repas";
const TITLE = "Application de planning de repas pour la famille";
const DESCRIPTION =
  "Planifiez les repas de la semaine (ou du mois) en quelques clics : l'app remplit le calendrier selon vos goûts et allergies, et génère la liste de courses. En finir avec le « on mange quoi ce soir ? ».";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", url: PATH, title: TITLE, description: DESCRIPTION },
};

const DATA: FeatureLandingData = {
  eyebrow: "Planning des repas",
  title: "Le planning des repas de la famille, sans prise de tête",
  intro:
    "Organisez les déjeuners et dîners de la semaine — ou planifiez des mois à l'avance. Décidez une fois, mangez bien toute la semaine.",
  canonicalPath: PATH,
  bullets: [
    { emoji: "🗓️", title: "Un calendrier clair", text: "Midi et soir, semaine par semaine, d'un coup d'œil. Glissez une recette sur un jour, c'est planifié." },
    { emoji: "✨", title: "Remplissage automatique", text: "L'app complète les trous toute seule en respectant vos goûts, vos allergies et vos interdits alimentaires." },
    { emoji: "🛒", title: "La liste de courses suit", text: "Chaque repas planifié alimente une liste de courses automatique, rangée par rayon." },
    { emoji: "📖", title: "Vos recettes à vous", text: "Le planning puise dans votre carnet — les plats que votre famille aime déjà, pas un catalogue imposé." },
  ],
  steps: [
    { title: "Constituez votre carnet", text: "Ajoutez vos plats favoris ou laissez l'assistant les créer pour vous, puis validez." },
    { title: "Planifiez la semaine", text: "Placez les repas à la main, ou générez un planning automatique équilibré en un clic." },
    { title: "Passez à table", text: "La liste de courses est prête, et le mode cuisine vous guide le jour J." },
  ],
  related: [
    { href: "/liste-de-courses", label: "La liste de courses automatique" },
    { href: "/batch-cooking", label: "Le batch cooking guidé" },
    { href: "/guide/menu-batch-cooking-semaine", label: "Un menu d'une semaine, prêt à suivre" },
  ],
  faq: [
    { q: "Peut-on planifier plusieurs semaines à l'avance ?", a: "Oui. Vous pouvez planifier semaine par semaine à la main, ou générer automatiquement un planning sur une longue période." },
    { q: "L'app tient-elle compte des allergies ?", a: "Oui. Vous déclarez les allergies et les aliments interdits du foyer, et le planning comme les suggestions les respectent." },
    { q: "Faut-il repartir de zéro chaque semaine ?", a: "Non. Le planning s'appuie sur votre carnet de recettes et peut se régénérer en un clic, en évitant de répéter trop souvent les mêmes plats." },
  ],
};

export default function PlanningRepasPage() {
  return <FeatureLanding {...DATA} />;
}
