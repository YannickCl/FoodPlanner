import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2 } from "../../_components/guide-ui";

const TITLE = "Idées de repas pour la semaine (rapides, végé, famille)";
const DESCRIPTION =
  "Une banque d'idées de repas pour la semaine, classées par envie : rapides, végétariens, poisson, mijotés, sans four, pour les enfants et vide-frigo. De quoi remplir votre menu sans jamais sécher.";
const PUBLISHED = "2026-08-17";
const PATH = "/guide/idees-repas-semaine";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const CATEGORIES: { emoji: string; title: string; ideas: string[] }[] = [
  {
    emoji: "⚡",
    title: "Rapides (moins de 20 min)",
    ideas: ["Pâtes ail, huile d'olive & parmesan", "Omelette aux herbes + salade", "Wok de légumes et nouilles", "Croque-monsieur maison", "Quesadillas haricots-fromage", "Poêlée de gnocchis et tomates cerises"],
  },
  {
    emoji: "🥕",
    title: "Végétariens",
    ideas: ["Dahl de lentilles corail", "Curry de légumes au lait de coco", "Gratin de courgettes", "Chili sin carne", "Buddha bowl (céréales, légumes, houmous)", "Tarte aux poireaux"],
  },
  {
    emoji: "🐟",
    title: "Poisson",
    ideas: ["Filet de cabillaud, légumes rôtis", "Saumon teriyaki, riz", "Papillote de poisson blanc", "Pâtes au thon et citron", "Poêlée de crevettes à l'ail", "Brandade de poisson"],
  },
  {
    emoji: "🍲",
    title: "Mijotés & cocotte",
    ideas: ["Blanquette de veau", "Chili con carne", "Bœuf bourguignon", "Poulet basquaise", "Tajine de légumes", "Soupe complète (légumes + légumineuses)"],
  },
  {
    emoji: "🔥",
    title: "Au four (mains libres)",
    ideas: ["Poulet rôti et pommes de terre", "Gratin de pâtes", "Légumes rôtis + protéine", "Lasagnes", "Parmentier (bœuf ou poisson)", "Pizza maison"],
  },
  {
    emoji: "🧒",
    title: "Qui plaisent aux enfants",
    ideas: ["Burgers maison", "Boulettes sauce tomate & pâtes", "Riz cantonais", "Croque-tortilla", "Nuggets maison et purée", "Galettes de légumes râpés"],
  },
  {
    emoji: "🧊",
    title: "Vide-frigo",
    ideas: ["Frittata (restes de légumes + œufs)", "Soupe de fanes et épluchures", "Riz sauté aux restes", "Quiche « ce qu'il reste »", "Gratin de pain perdu salé", "Salade complète composée"],
  },
];

const FAQ = [
  {
    q: "Comment trouver des idées de repas quand on sèche ?",
    a: "Le plus efficace est de raisonner par catégorie d'envie (rapide, végé, poisson…) plutôt que de chercher « une idée » dans le vide. Gardez une banque d'une vingtaine de plats et faites-les tourner.",
  },
  {
    q: "Comment transformer ces idées en menu de la semaine ?",
    a: "Attribuez une catégorie à chaque jour (lundi rapide, mardi poisson, mercredi végé…), puis choisissez une idée dans chaque catégorie. Vous obtenez un menu varié en quelques minutes.",
  },
  {
    q: "Comment éviter de manger toujours la même chose ?",
    a: "Alternez les catégories et espacez les répétitions. Piocher dans une liste large comme celle-ci, plutôt que dans vos 3-4 réflexes habituels, suffit à renouveler les repas.",
  },
];

export default function IdeesRepasPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Idées de repas pour la semaine" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Banque d&rsquo;idées</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Idées de repas pour la semaine
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Plus de page blanche. Voici une banque d&rsquo;idées classées par
          envie&nbsp;: piochez-y pour composer votre menu de la semaine en
          quelques minutes.
        </p>
      </header>

      <div className="space-y-6">
        {CATEGORIES.map((c) => (
          <Card key={c.title} className="p-5">
            <h2 className="mb-3 font-display text-xl text-ink">
              <span className="mr-2" aria-hidden>{c.emoji}</span>
              {c.title}
            </h2>
            <ul className="grid gap-x-6 gap-y-1.5 text-sm text-ink sm:grid-cols-2">
              {c.ideas.map((idea) => (
                <li key={idea} className="relative pl-4 before:absolute before:left-0 before:text-gold before:content-['–']">
                  {idea}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-10 space-y-10 text-ink-soft">
        <section>
          <H2>Des idées au menu, en 2 minutes</H2>
          <p>
            Le plus dur n&rsquo;est pas de trouver des idées, mais de les{" "}
            <strong className="text-ink">organiser</strong>. Attribuez un thème à
            chaque jour, choisissez une idée par thème, et déduisez-en la liste de
            courses. Notre{" "}
            <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              guide du menu de la semaine
            </Link>{" "}
            détaille la méthode, et le{" "}
            <Link href="/planning-repas" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              planning de repas
            </Link>{" "}
            le fait pour vous.
          </p>
        </section>

        <GuideCta
          title="Laissez l'app remplir les trous"
          text="Dites-nous les plats que votre famille aime : le planning se remplit tout seul en respectant vos goûts et allergies, et la liste de courses suit."
          secondaryHref="/guide/menu-de-la-semaine"
          secondaryLabel="La méthode du menu"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
