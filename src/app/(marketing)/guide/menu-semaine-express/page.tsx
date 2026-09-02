import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import { PrintButton } from "../../_components/PrintButton";
import { Faq, GuideCta, H2, Li } from "../../_components/guide-ui";

const TITLE = "Menu de la semaine express : 7 dîners en moins de 30 minutes (+ liste de courses)";
const DESCRIPTION =
  "Un menu de la semaine 100 % rapide : 7 dîners prêts en moins de 30 minutes pour la famille, avec la liste de courses par rayon à imprimer. Pour les soirs pressés, sans sacrifier l'équilibre.";
const PUBLISHED = "2026-09-01";
const URL_PATH = "/guide/menu-semaine-express";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_PATH },
  openGraph: { type: "article", url: URL_PATH, title: TITLE, description: DESCRIPTION },
};

const MENU: { jour: string; plat: string; temps: string }[] = [
  { jour: "Lundi", plat: "One-pot pasta tomate & thon", temps: "20 min" },
  { jour: "Mardi", plat: "Wok de poulet & légumes + riz", temps: "25 min" },
  { jour: "Mercredi", plat: "Omelette garnie & salade verte", temps: "15 min" },
  { jour: "Jeudi", plat: "Gnocchis poêlés, tomates cerises & mozzarella", temps: "20 min" },
  { jour: "Vendredi", plat: "Fajitas de poulet & poivrons", temps: "25 min" },
  { jour: "Samedi", plat: "Burgers maison express & crudités", temps: "30 min" },
  { jour: "Dimanche", plat: "Soupe express & croque-monsieur", temps: "20 min" },
];

const COURSES: { rayon: string; items: string[] }[] = [
  {
    rayon: "Boucherie & poissonnerie",
    items: ["600 g d'escalopes de poulet", "1 boîte de thon", "400 g de bœuf haché"],
  },
  {
    rayon: "Fruits & légumes",
    items: [
      "2 oignons",
      "1 tête d'ail",
      "2 poivrons",
      "2 courgettes",
      "1 barquette de tomates cerises",
      "1 salade + crudités (concombre, carottes)",
      "1 sachet de légumes pour soupe (ou surgelés)",
    ],
  },
  {
    rayon: "Épicerie",
    items: [
      "500 g de pâtes",
      "300 g de riz",
      "2 boîtes de tomates concassées",
      "1 sachet de gnocchis",
      "Galettes à fajitas + épices",
      "Pains à burger",
      "Huile d'olive, sauces",
    ],
  },
  {
    rayon: "Crémerie",
    items: ["6 œufs", "1 mozzarella", "Fromage à burger", "Pain de mie", "Jambon & fromage (croque)"],
  },
];

const FAQ = [
  {
    q: "Peut-on manger équilibré avec des repas de moins de 30 minutes ?",
    a: "Oui. La clé est d'associer une protéine (poulet, œufs, thon, bœuf), un féculent (pâtes, riz, pain) et des légumes (frais, surgelés ou en conserve). Les légumes surgelés et les conserves de qualité font gagner un temps précieux sans nuire à l'équilibre.",
  },
  {
    q: "Comment aller encore plus vite le soir ?",
    a: "Préparez en amont ce qui prend du temps : légumes lavés et coupés, protéines cuites d'avance, sauces prêtes. C'est le principe du meal prep : le soir, il ne reste plus qu'à assembler et réchauffer.",
  },
  {
    q: "Ces recettes conviennent-elles aux enfants ?",
    a: "Oui : one-pot pasta, gnocchis, fajitas, burgers maison et croque-monsieur sont des valeurs sûres. Servez les crudités et sauces à part pour que chacun se compose son assiette.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      inLanguage: "fr-FR",
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      author: { "@type": "Organization", name: APP_NAME },
      publisher: { "@type": "Organization", name: APP_NAME },
      mainEntityOfPage: `${SITE_URL}${URL_PATH}`,
      isPartOf: `${SITE_URL}/guide/menu-de-la-semaine`,
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function MenuSemaineExpressPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <nav className="no-print mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>{" "}
        <span aria-hidden>›</span>{" "}
        <Link href="/guide/menu-de-la-semaine" className="hover:text-ink">
          Guide
        </Link>{" "}
        <span aria-hidden>›</span>{" "}
        <span className="text-ink">Menu de la semaine express</span>
      </nav>

      <header className="no-print mb-8">
        <p className="eyebrow mb-2">Menu de saison rapide</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Menu de la semaine express
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          7 dîners prêts en <strong className="text-ink">moins de 30 minutes</strong>{" "}
          pour toute la famille, pour les soirs où le temps manque — sans sacrifier
          l&rsquo;équilibre. Le menu complet et la liste de courses par rayon, à
          imprimer.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <PrintButton />
          <Link
            href="/guide/menu-de-la-semaine"
            className="rounded-full px-2 py-2.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            ← La méthode du menu de la semaine
          </Link>
        </div>
      </header>

      <section className="print-area space-y-6">
        <div className="hidden print:block">
          <h2 className="font-display text-2xl text-ink">
            Menu express — une semaine
          </h2>
          <p className="text-sm text-ink-soft">{APP_NAME}</p>
        </div>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-2xl text-ink">Le menu de la semaine</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink-soft">
                  <th className="py-2 pr-3 font-semibold">Jour</th>
                  <th className="py-2 pr-3 font-semibold">Dîner</th>
                  <th className="py-2 font-semibold">Temps</th>
                </tr>
              </thead>
              <tbody>
                {MENU.map((m) => (
                  <tr key={m.jour} className="border-b border-line/60 align-top">
                    <td className="py-2 pr-3 font-medium text-ink">{m.jour}</td>
                    <td className="py-2 pr-3 text-ink">{m.plat}</td>
                    <td className="num py-2 text-ink-soft">{m.temps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-2xl text-ink">
            La liste de courses (famille de 4)
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {COURSES.map((c) => (
              <div key={c.rayon}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
                  {c.rayon}
                </p>
                <ul className="space-y-1 text-sm text-ink">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span aria-hidden className="text-ink-soft">
                        ☐
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div className="no-print mt-10 space-y-10 text-ink-soft">
        <section>
          <H2>3 réflexes pour des dîners vraiment rapides</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Le « one-pot »&nbsp;:</strong> pâtes ou riz qui
              cuisent directement dans la sauce = un seul récipient, moins de vaisselle,
              moins de temps.
            </Li>
            <Li>
              <strong className="text-ink">Les alliés du placard&nbsp;:</strong> conserves
              (thon, tomates, légumineuses) et surgelés (légumes, poêlées) coupent le
              temps de préparation de moitié.
            </Li>
            <Li>
              <strong className="text-ink">Anticiper&nbsp;:</strong> en préparant légumes et
              protéines à l&rsquo;avance (
              <Link href="/guide/meal-prep-debutant" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
                meal prep
              </Link>
              ), le dîner tombe à 10 minutes.
            </Li>
          </ul>
        </section>

        <GuideCta
          title="Vos dîners express, planifiés pour vous"
          text={`${APP_NAME} compose votre menu de la semaine à partir de vos plats rapides préférés, respecte vos goûts et vos allergies, et génère la liste de courses par rayon automatiquement.`}
          secondaryHref="/guide/que-manger-ce-soir"
          secondaryLabel="Que manger ce soir ?"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
