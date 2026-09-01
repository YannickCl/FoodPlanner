import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import { PrintButton } from "../../_components/PrintButton";
import { Faq, GuideCta, H2, Li } from "../../_components/guide-ui";

const TITLE = "Menu de la semaine d'automne (7 dîners de saison + liste de courses)";
const DESCRIPTION =
  "Un menu de la semaine 100 % automne : 7 dîners de saison pour la famille (courge, champignons, poireaux, légumes racines), avec la liste de courses par rayon à imprimer. Réconfortant, de saison et économique.";
const PUBLISHED = "2026-09-01";
const URL_PATH = "/guide/menu-semaine-automne";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_PATH },
  openGraph: { type: "article", url: URL_PATH, title: TITLE, description: DESCRIPTION },
};

// Menu de la semaine (7 dîners, famille de 4), produits d'automne.
const MENU: { jour: string; plat: string; saison: string }[] = [
  { jour: "Lundi", plat: "Velouté de potimarron + tartines de chèvre", saison: "Potimarron" },
  { jour: "Mardi", plat: "Gratin de pâtes aux champignons & épinards", saison: "Champignons" },
  { jour: "Mercredi", plat: "Curry de butternut & pois chiches + riz", saison: "Courge butternut" },
  { jour: "Jeudi", plat: "Poêlée de poireaux, pommes de terre & œufs", saison: "Poireaux" },
  { jour: "Vendredi", plat: "Tartiflette (ou gratin de chou-fleur)", saison: "Pomme de terre" },
  { jour: "Samedi", plat: "Tarte fine oignons & champignons + salade", saison: "Oignons" },
  { jour: "Dimanche", plat: "Poulet rôti aux légumes racines", saison: "Carottes, panais" },
];

// Liste de courses par rayon (famille de 4).
const COURSES: { rayon: string; items: string[] }[] = [
  {
    rayon: "Fruits & légumes",
    items: [
      "1 potimarron (~1 kg)",
      "1 courge butternut (~800 g)",
      "500 g de champignons de Paris",
      "3 poireaux",
      "1 kg de pommes de terre",
      "5 carottes",
      "2 panais",
      "3 oignons",
      "1 tête d'ail",
      "1 chou-fleur (option gratin)",
      "1 salade + 2 pommes",
    ],
  },
  {
    rayon: "Boucherie & crémerie",
    items: [
      "1 poulet entier (~1,5 kg)",
      "200 g de lardons (tartiflette)",
      "1 reblochon (tartiflette)",
      "1 bûche de chèvre",
      "200 g de fromage râpé",
      "1 pâte feuilletée",
      "6 œufs",
      "1 brique de crème",
    ],
  },
  {
    rayon: "Épicerie",
    items: [
      "500 g de pâtes",
      "300 g de riz",
      "1 boîte de pois chiches",
      "1 brique de lait de coco",
      "1 cube de bouillon de légumes",
      "Pâte de curry (ou curry en poudre)",
      "Huile d'olive, muscade",
    ],
  },
  {
    rayon: "Surgelés (option)",
    items: ["Épinards en branches", "Poêlée de champignons"],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Quels légumes sont de saison en automne ?",
    a: "L'automne est la pleine saison des courges (potimarron, butternut, potiron), des champignons, des poireaux, des choux, des carottes et des légumes racines (panais, navet, betterave), ainsi que des pommes, poires et raisins. Ce sont les produits les moins chers et les plus savoureux de la saison.",
  },
  {
    q: "Ce menu d'automne convient-il aux enfants ?",
    a: "Oui : le velouté de potimarron, le gratin de pâtes, la tartiflette et le poulet rôti sont des valeurs sûres. Pour le curry, dosez les épices légèrement. Le potimarron passé en velouté fait souvent aimer la courge aux enfants récalcitrants.",
  },
  {
    q: "Peut-on préparer ce menu en batch cooking ?",
    a: "Tout à fait. Le velouté, le curry et le poulet rôti (dont on récupère la carcasse pour un bouillon) se préparent en avance et se congèlent bien. Une session du dimanche suffit à prendre une belle avance sur la semaine.",
  },
  {
    q: "Comment rendre ce menu végétarien ?",
    a: "Remplacez le poulet rôti par un plateau de légumes racines rôtis + halloumi, la tartiflette par un gratin de chou-fleur, et retirez les lardons. Les autres plats (velouté, gratin de pâtes, curry, poêlée d'œufs, tarte) sont déjà végétariens.",
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

export default function MenuSemaineAutomnePage() {
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
        <span className="text-ink">Menu de la semaine d&rsquo;automne</span>
      </nav>

      <header className="no-print mb-8">
        <p className="eyebrow mb-2">Menu de saison</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Menu de la semaine d&rsquo;automne
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          7 dîners de saison pour la famille — courge, champignons, poireaux,
          légumes racines — réconfortants et économiques. Le menu complet et la
          liste de courses par rayon, à imprimer et à suivre tel quel.
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

      {/* ---- Bloc imprimable : menu + liste de courses ---- */}
      <section className="print-area space-y-6">
        <div className="hidden print:block">
          <h2 className="font-display text-2xl text-ink">
            Menu d&rsquo;automne — une semaine
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
                  <th className="py-2 font-semibold">Produit de saison</th>
                </tr>
              </thead>
              <tbody>
                {MENU.map((m) => (
                  <tr key={m.jour} className="border-b border-line/60 align-top">
                    <td className="py-2 pr-3 font-medium text-ink">{m.jour}</td>
                    <td className="py-2 pr-3 text-ink">{m.plat}</td>
                    <td className="py-2 text-ink-soft">{m.saison}</td>
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
          <H2>Pourquoi cuisiner de saison en automne</H2>
          <p className="mb-4">
            Manger de saison, c&rsquo;est trois avantages d&rsquo;un coup&nbsp;: des légumes{" "}
            <strong className="text-ink">moins chers</strong> (pleine récolte), plus{" "}
            <strong className="text-ink">savoureux</strong>, et une cuisine qui colle à
            l&rsquo;envie de <strong className="text-ink">réconfort</strong> quand les
            jours raccourcissent. Les courges, champignons et légumes racines sont
            parfaits pour les veloutés, gratins et plats mijotés.
          </p>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Les stars de l&rsquo;automne&nbsp;:</strong>{" "}
              potimarron, butternut, champignons, poireaux, choux, carottes, panais,
              pommes et poires.
            </Li>
            <Li>
              <strong className="text-ink">L&rsquo;astuce anti-gaspi&nbsp;:</strong> la
              carcasse du poulet du dimanche donne un bouillon maison pour le velouté ou
              le risotto de la semaine suivante.
            </Li>
          </ul>
        </section>

        <GuideCta
          title="Votre menu d'automne, adapté à vos goûts"
          text={`Dites à ${APP_NAME} les plats que votre famille aime : l'app compose le menu de la semaine, respecte la saison et vos allergies, et génère la liste de courses par rayon automatiquement.`}
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
