import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/brand";

const TITLE = "Guides & conseils pour organiser les repas de la famille";
const DESCRIPTION = `Tous nos guides pour planifier les repas de la semaine, faire du batch cooking, alléger la charge mentale et ne plus jamais se demander « on mange quoi ce soir ? ». Par ${APP_NAME}.`;

export const metadata: Metadata = {
  title: "Guides & conseils",
  description: DESCRIPTION,
  alternates: { canonical: "/guide" },
  openGraph: { url: "/guide", title: TITLE, description: DESCRIPTION },
};

type Item = { path: string; title: string; teaser: string; emoji: string };

const SECTIONS: { heading: string; intro: string; items: Item[] }[] = [
  {
    heading: "Les essentiels",
    intro: "Les méthodes de fond pour reprendre la main sur les repas.",
    items: [
      { path: "/guide/menu-de-la-semaine", emoji: "🗓️", title: "Le menu de la semaine", teaser: "La méthode complète pour planifier une semaine de repas en quinze minutes." },
      { path: "/guide/batch-cooking", emoji: "🍲", title: "Le batch cooking", teaser: "Cuisiner plusieurs repas en une seule session : le guide pour débuter." },
      { path: "/guide/meal-prep-debutant", emoji: "🥡", title: "Le meal prep pour débuter", teaser: "Préparer ses repas de la semaine à l'avance, méthode en 5 étapes." },
      { path: "/guide/charge-mentale-repas", emoji: "🧠", title: "La charge mentale des repas", teaser: "Pourquoi « on mange quoi ce soir ? » épuise, et comment s'en libérer." },
    ],
  },
  {
    heading: "Guides pratiques",
    intro: "Des idées et des exemples prêts à l'emploi.",
    items: [
      { path: "/guide/que-manger-ce-soir", emoji: "⚡", title: "Que manger ce soir ?", teaser: "30 idées classées par situation : pressé·e, vide-frigo, réconfort…" },
      { path: "/guide/idees-repas-semaine", emoji: "💡", title: "Idées de repas pour la semaine", teaser: "Une banque d'idées par envie pour ne plus sécher devant le menu." },
      { path: "/guide/menu-semaine-express", emoji: "⏱️", title: "Menu de la semaine express", teaser: "7 dîners en moins de 30 minutes + liste de courses." },
      { path: "/guide/idees-petit-dejeuner-semaine", emoji: "🥐", title: "Petits-déjeuners de la semaine", teaser: "7 idées + des listes par envie (express, la veille, enfants)." },
      { path: "/guide/menu-vegetarien-semaine", emoji: "🥦", title: "Menu végétarien de la semaine", teaser: "7 dîners sans viande + la liste de courses à imprimer." },
      { path: "/guide/menu-semaine-automne", emoji: "🍂", title: "Menu de la semaine d'automne", teaser: "7 dîners de saison (courge, champignons…) + liste de courses." },
      { path: "/guide/organisation-repas-rentree", emoji: "🎒", title: "Organiser les repas de la rentrée", teaser: "Reprendre la main sur les repas de la famille dès la rentrée, sans stress." },
      { path: "/guide/menu-batch-cooking-semaine", emoji: "📋", title: "Menu batch cooking d'une semaine", teaser: "Un plan complet, session du dimanche et liste de courses incluses." },
      { path: "/guide/menu-equilibre-semaine", emoji: "🥗", title: "Menu de la semaine équilibré", teaser: "Composer des semaines variées et équilibrées, sans se compliquer." },
      { path: "/guide/menu-semaine-pas-cher", emoji: "💶", title: "Menu de la semaine pas cher", teaser: "Bien manger toute la semaine avec un budget maîtrisé." },
      { path: "/guide/recettes-qui-se-congelent", emoji: "🧊", title: "Recettes qui se congèlent", teaser: "Les plats à préparer en double pour un filet de sécurité au congélateur." },
      { path: "/guide/semainier-a-imprimer", emoji: "🖨️", title: "Semainier à imprimer", teaser: "Un planning de repas vierge à imprimer et remplir à la main." },
    ],
  },
  {
    heading: "Comparatifs",
    intro: "Pour choisir l'outil qui vous convient.",
    items: [
      { path: "/comparatif/jow", emoji: "⚖️", title: "Alternative à Jow", teaser: "Vos recettes, sans supermarché imposé : le comparatif honnête." },
      { path: "/comparatif/frigo-magic", emoji: "🧊", title: "Alternative à Frigo Magic", teaser: "Planifier la semaine, pas seulement vider le frigo." },
    ],
  },
];

function GuideCard({ item }: { item: Item }) {
  return (
    <Link
      href={item.path}
      className="group flex flex-col rounded-2xl border border-line bg-parchment-card p-5 transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
    >
      <span className="mb-2 text-2xl" aria-hidden>{item.emoji}</span>
      <h3 className="font-display text-xl text-ink">{item.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">{item.teaser}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold">
        Lire l&rsquo;article
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
      </span>
    </Link>
  );
}

export default function GuideIndexPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-10 text-center">
        <p className="eyebrow mb-2">Guides &amp; conseils</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Organiser les repas, sans prise de tête
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
          Nos méthodes et nos idées pour planifier la semaine, cuisiner malin et
          alléger la charge mentale des repas en famille.
        </p>
      </header>

      <div className="space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl text-ink">{section.heading}</h2>
            <p className="mb-4 text-sm text-ink-soft">{section.intro}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <GuideCard key={item.path} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/signup"
          className="inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-opacity hover:opacity-90"
        >
          Essayer {APP_NAME} gratuitement
        </Link>
      </div>
    </div>
  );
}
