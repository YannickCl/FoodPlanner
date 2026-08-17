import type { Metadata } from "next";
import { FeatureLanding, type FeatureLandingData } from "../_components/FeatureLanding";

const PATH = "/batch-cooking";
const TITLE = "Application de batch cooking guidé";
const DESCRIPTION =
  "Préparez plusieurs repas d'un coup, sans stress : l'app regroupe la mise en place, ordonne les cuissons et vous guide pas à pas avec des minuteurs. Le batch cooking, enfin simple — même pour débuter.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", url: PATH, title: TITLE, description: DESCRIPTION },
};

const DATA: FeatureLandingData = {
  eyebrow: "Batch cooking",
  title: "Le batch cooking, guidé pas à pas",
  intro:
    "Cuisinez une fois, mangez bien toute la semaine. L'app transforme vos repas en un plan de préparation clair, du plan de travail jusqu'aux boîtes.",
  canonicalPath: PATH,
  bullets: [
    { emoji: "🧺", title: "Mise en place groupée", text: "Tous les épluchages et découpes rassemblés : vous préparez une fois ce qui sert à plusieurs plats." },
    { emoji: "🔥", title: "Cuissons ordonnées", text: "L'app lance d'abord les cuissons les plus longues et fait tourner four et casseroles en parallèle." },
    { emoji: "⏱️", title: "Session guidée + minuteurs", text: "Une étape à la fois, avec minuteurs intégrés. Idéal quand on débute et qu'on ne sait pas par où commencer." },
    { emoji: "🥡", title: "Conservation suivie", text: "Marquez les plats « préparés à l'avance » : vous recevez un rappel pour réchauffer plutôt que pour cuisiner." },
  ],
  steps: [
    { title: "Choisissez les repas", text: "Sélectionnez les plats de la semaine à préparer en une session." },
    { title: "Suivez le plan", text: "L'app génère la mise en place groupée, l'ordre des cuissons et la liste de courses." },
    { title: "Cuisinez en une fois", text: "Laissez-vous guider pas à pas, rangez et étiquetez. La semaine est prête." },
  ],
  related: [
    { href: "/guide/batch-cooking", label: "Le guide complet du batch cooking" },
    { href: "/guide/menu-batch-cooking-semaine", label: "Un menu batch d'une semaine" },
    { href: "/planning-repas", label: "Le planning des repas" },
  ],
  faq: [
    { q: "Le batch cooking, c'est réservé aux experts ?", a: "Non. La session est guidée étape par étape, avec minuteurs : c'est justement pensé pour accompagner les débutants." },
    { q: "Faut-il du matériel spécial ?", a: "Non. Des boîtes hermétiques et quelques casseroles suffisent. Notre guide détaille tout ce qu'il faut savoir." },
    { q: "Le batch cooking fait-il partie de l'offre gratuite ?", a: "Le batch cooking guidé fait partie de l'offre Premium. La planification, la liste de courses et le mode cuisine restent gratuits." },
  ],
};

export default function BatchCookingPage() {
  return <FeatureLanding {...DATA} />;
}
