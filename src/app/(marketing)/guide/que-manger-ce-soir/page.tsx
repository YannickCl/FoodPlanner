import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2 } from "../../_components/guide-ui";

const TITLE = "Que manger ce soir ? 30 idées de repas (rapides, vide-frigo, réconfort)";
const DESCRIPTION =
  "Panne d'inspiration pour le dîner ? Voici 30 idées de repas pour ce soir, classées par situation : pressé·e, vide-frigo, réconfort, léger, pour les enfants, zéro effort. Et la méthode pour ne plus jamais se poser la question.";
const PUBLISHED = "2026-09-01";
const PATH = "/guide/que-manger-ce-soir";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const SITUATIONS: { emoji: string; title: string; ideas: string[] }[] = [
  {
    emoji: "⚡",
    title: "Je suis pressé·e (moins de 15 min)",
    ideas: ["Pâtes ail, huile d'olive & parmesan", "Omelette aux herbes + salade", "Wok de nouilles et légumes", "Quesadillas haricots-fromage", "Poêlée de gnocchis et tomates cerises"],
  },
  {
    emoji: "🧊",
    title: "Je n'ai pas fait de courses (vide-frigo)",
    ideas: ["Frittata avec les restes de légumes", "Riz sauté « ce qu'il reste »", "Soupe de légumes + tartines de fromage", "Quiche vide-frigo", "Salade complète composée (œuf, thon, légumineuses)"],
  },
  {
    emoji: "🛋️",
    title: "J'ai envie de réconfort",
    ideas: ["Gratin de pâtes", "Croque-monsieur maison + salade", "Purée maison & saucisse", "Soupe de potiron et croûtons", "Chili con carne"],
  },
  {
    emoji: "🥗",
    title: "Je veux léger et sain",
    ideas: ["Filet de poisson en papillote + légumes vapeur", "Buddha bowl (céréales, légumes, houmous)", "Poêlée de crevettes à l'ail et courgettes", "Dahl de lentilles corail", "Salade de quinoa, feta et légumes"],
  },
  {
    emoji: "🧒",
    title: "Ça doit plaire aux enfants",
    ideas: ["Boulettes sauce tomate & pâtes", "Riz cantonais", "Nuggets maison et purée", "Burgers maison", "Galettes de légumes râpés"],
  },
  {
    emoji: "🍳",
    title: "Zéro effort (une poêle, un plat)",
    ideas: ["Poulet rôti et pommes de terre au four", "One-pot pasta (pâtes qui cuisent dans la sauce)", "Poêlée complète riz-légumes-protéine", "Tartiflette express", "Œufs cocotte au four"],
  },
];

const FAQ = [
  {
    q: "Que manger ce soir quand on n'a aucune idée ?",
    a: "Partez de votre situation plutôt que d'une recette : pressé·e, vide-frigo, envie de réconfort… Choisissez la catégorie qui vous correspond ce soir et piochez une idée dedans. C'est bien plus rapide que de chercher « une idée » dans le vide.",
  },
  {
    q: "Que faire pour le dîner quand le frigo est presque vide ?",
    a: "Les valeurs sûres du vide-frigo : une frittata ou une quiche (œufs + restes), un riz sauté, une soupe avec des tartines, ou une salade composée. Presque tout se recycle en un plat correct.",
  },
  {
    q: "Comment ne plus se demander quoi manger chaque soir ?",
    a: "La solution durable est de décider une fois pour la semaine plutôt que chaque jour. Un menu de la semaine (même flexible) supprime la question quotidienne et la charge mentale qui va avec.",
  },
  {
    q: "Quel repas rapide et sain pour ce soir ?",
    a: "Un poisson en papillote avec des légumes, un buddha bowl, un dahl de lentilles ou une poêlée de crevettes et courgettes se préparent en 15-20 minutes et restent légers.",
  },
];

export default function QueMangerCeSoirPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Que manger ce soir ?" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Idées express</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Que manger ce soir&nbsp;?
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          La question qui revient chaque jour, souvent à 18&nbsp;h, la tête déjà pleine. Voici
          30&nbsp;idées classées <strong className="text-ink">par situation</strong>&nbsp;: trouvez
          la vôtre, piochez une idée, et c&rsquo;est réglé.
        </p>
      </header>

      <div className="space-y-6">
        {SITUATIONS.map((s) => (
          <Card key={s.title} className="p-5">
            <h2 className="mb-3 font-display text-xl text-ink">
              <span className="mr-2" aria-hidden>{s.emoji}</span>
              {s.title}
            </h2>
            <ul className="grid gap-x-6 gap-y-1.5 text-sm text-ink sm:grid-cols-2">
              {s.ideas.map((idea) => (
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
          <H2>Ne plus jamais se poser la question</H2>
          <p>
            Se demander «&nbsp;on mange quoi ce soir&nbsp;?&nbsp;» chaque jour, c&rsquo;est une
            petite décision répétée 365&nbsp;fois par an — et une vraie{" "}
            <Link href="/guide/charge-mentale-repas" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              charge mentale
            </Link>
            . La parade&nbsp;: décider <strong className="text-ink">une fois pour la semaine</strong>.
            Notre{" "}
            <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              guide du menu de la semaine
            </Link>{" "}
            explique la méthode, et le{" "}
            <Link href="/planning-repas" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              planning de repas
            </Link>{" "}
            le fait pour vous. Besoin de plus d&rsquo;idées&nbsp;? Voyez notre banque d&rsquo;
            <Link href="/guide/idees-repas-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              idées de repas pour la semaine
            </Link>
            .
          </p>
        </section>

        <GuideCta
          title="Fini le « on mange quoi ce soir ? »"
          text="Dites-nous les plats que votre famille aime : Chill Meals compose le menu de la semaine à votre place, en respectant vos goûts et allergies, et génère la liste de courses. La question du soir disparaît."
          secondaryHref="/guide/menu-de-la-semaine"
          secondaryLabel="La méthode du menu de la semaine"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
