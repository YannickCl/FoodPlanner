import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import { PrintButton } from "../../_components/PrintButton";

const TITLE = "Menu batch cooking d'une semaine (avec liste de courses)";
const DESCRIPTION =
  "Un menu batch cooking complet pour une semaine : 7 dîners pour une famille, le plan de la session de cuisine et la liste de courses par rayon, à imprimer. Prêt à suivre, même pour débuter.";
const PUBLISHED = "2026-08-17";
const URL_PATH = "/guide/menu-batch-cooking-semaine";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_PATH },
  openGraph: {
    type: "article",
    url: URL_PATH,
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Le menu de la semaine (7 dîners, famille de 4).
const MENU: { jour: string; plat: string; base: string; minute: string }[] = [
  { jour: "Lundi", plat: "Chili con carne + riz", base: "Chili, riz", minute: "Coriandre fraîche" },
  { jour: "Mardi", plat: "Poulet rôti + légumes rôtis", base: "Poulet, légumes rôtis", minute: "—" },
  { jour: "Mercredi", plat: "Soupe de légumes + tartines gratinées", base: "Soupe", minute: "Pain + fromage au four" },
  { jour: "Jeudi", plat: "Bowl riz, légumes & poulet effiloché", base: "Riz, légumes, poulet", minute: "Crudités, sauce" },
  { jour: "Vendredi", plat: "Pâtes à la sauce tomate & poulet", base: "Sauce tomate, poulet", minute: "Parmesan" },
  { jour: "Samedi", plat: "Tacos de chili", base: "Chili", minute: "Tortillas, fromage, salade" },
  { jour: "Dimanche", plat: "Soupe + omelette", base: "Soupe, œufs", minute: "Herbes" },
];

// Liste de courses par rayon (famille de 4).
const COURSES: { rayon: string; items: string[] }[] = [
  {
    rayon: "Boucherie",
    items: ["1 poulet entier (~1,5 kg)", "500 g de bœuf haché"],
  },
  {
    rayon: "Fruits & légumes",
    items: [
      "4 oignons",
      "1 tête d'ail",
      "6 carottes",
      "2 courgettes",
      "2 poivrons",
      "1 courge butternut (~800 g)",
      "1 salade + crudités (concombre, radis)",
      "1 bouquet de coriandre ou persil",
    ],
  },
  {
    rayon: "Épicerie",
    items: [
      "500 g de riz",
      "500 g de pâtes",
      "2 boîtes de haricots rouges",
      "1 boîte de maïs",
      "3 boîtes de tomates concassées",
      "1 tube de concentré de tomate",
      "1 cube de bouillon de légumes",
      "Huile d'olive",
      "Épices : cumin, paprika, origan",
      "8 tortillas (tacos)",
    ],
  },
  {
    rayon: "Crémerie & œufs",
    items: ["200 g de fromage râpé", "1 morceau de parmesan", "6 œufs", "Crème (facultatif)"],
  },
  {
    rayon: "Boulangerie",
    items: ["1 pain de campagne"],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Ce menu batch cooking est prévu pour combien de personnes ?",
    a: "Pour une famille de 4. Les quantités s'ajustent facilement : comptez environ un poulet, 500 g de haché, 500 g de riz et 500 g de pâtes pour 4 personnes sur la semaine.",
  },
  {
    q: "Combien de temps dure la session de cuisine ?",
    a: "Environ 2 h 30 pour préparer toutes les bases de la semaine, en faisant tourner plusieurs cuissons en parallèle (mijoté, four, casseroles).",
  },
  {
    q: "Peut-on tout congeler ?",
    a: "Le chili, la soupe et la sauce tomate se congèlent parfaitement. Le riz et le poulet se conservent mieux au réfrigérateur (3-4 jours) mais peuvent aussi se congeler. Refroidissez toujours rapidement avant de mettre au froid.",
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
      isPartOf: `${SITE_URL}/guide/batch-cooking`,
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

export default function MenuBatchSemainePage() {
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
        <Link href="/guide/batch-cooking" className="hover:text-ink">
          Guide
        </Link>{" "}
        <span aria-hidden>›</span>{" "}
        <span className="text-ink">Menu d&rsquo;une semaine</span>
      </nav>

      <header className="no-print mb-8">
        <p className="eyebrow mb-2">Menu prêt à suivre</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Menu batch cooking d&rsquo;une semaine
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          7 dîners pour une famille, préparés en une session d&rsquo;environ
          2&nbsp;h&nbsp;30. Voici le menu, le plan de la session et la liste de
          courses par rayon — à imprimer et à suivre tel quel.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <PrintButton />
          <Link
            href="/guide/batch-cooking"
            className="rounded-full px-2 py-2.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            ← Lire le guide complet du batch cooking
          </Link>
        </div>
      </header>

      {/* ---- Bloc imprimable : menu + liste de courses ---- */}
      <section className="print-area space-y-6">
        <div className="hidden print:block">
          <h2 className="font-display text-2xl text-ink">
            Menu batch cooking — une semaine
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
                  <th className="py-2 font-semibold">Touche minute</th>
                </tr>
              </thead>
              <tbody>
                {MENU.map((m) => (
                  <tr key={m.jour} className="border-b border-line/60 align-top">
                    <td className="py-2 pr-3 font-medium text-ink">{m.jour}</td>
                    <td className="py-2 pr-3 text-ink">
                      {m.plat}
                      <span className="block text-xs text-ink-soft">
                        Base : {m.base}
                      </span>
                    </td>
                    <td className="py-2 text-ink-soft">{m.minute}</td>
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
          <H2>Le plan de la session (l&rsquo;ordre qui fait gagner du temps)</H2>
          <p className="mb-4">
            La clé&nbsp;: lancer d&rsquo;abord ce qui cuit longtemps, puis remplir
            les temps morts. Voici l&rsquo;enchaînement pour préparer les six bases
            de la semaine.
          </p>
          <Step n={1} title="Lancer les cuissons longues">
            Démarrez le <strong className="text-ink">chili</strong> (mijote
            ~45&nbsp;min) et enfournez le{" "}
            <strong className="text-ink">poulet entier + la plaque de légumes</strong>{" "}
            (~1&nbsp;h au four). Ils cuisent tout seuls pendant le reste.
          </Step>
          <Step n={2} title="Occuper les temps morts">
            Pendant ce temps, faites cuire le{" "}
            <strong className="text-ink">riz</strong> en grande quantité et les{" "}
            <strong className="text-ink">œufs durs</strong>.
          </Step>
          <Step n={3} title="Deux casseroles en parallèle">
            Lancez la <strong className="text-ink">sauce tomate maison</strong> et
            la <strong className="text-ink">soupe de légumes</strong> (courge +
            carottes) côte à côte.
          </Step>
          <Step n={4} title="Refroidir, conditionner, étiqueter">
            Laissez refroidir (moins de 2&nbsp;h), répartissez en boîtes,{" "}
            <strong className="text-ink">notez la date</strong>, et rangez frigo ou
            congélateur.
          </Step>
        </section>

        <section>
          <H2>Où ranger chaque plat</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Au frigo (3-4 jours)&nbsp;:</strong>{" "}
              poulet, riz, légumes rôtis, sauce tomate — vous les mangez en début
              de semaine.
            </Li>
            <Li>
              <strong className="text-ink">Au congélateur&nbsp;:</strong> une part
              de chili pour samedi et de la soupe pour dimanche, si votre frigo
              approche des 4 jours.
            </Li>
            <Li>
              <strong className="text-ink">Le riz&nbsp;:</strong> refroidissez-le en
              moins d&rsquo;une heure avant de le réfrigérer (question de sécurité
              alimentaire).
            </Li>
          </ul>
        </section>

        <section>
          <Card className="border-gold/40 bg-gold-soft/30 p-6 text-center">
            <h2 className="font-display text-2xl text-ink">
              Ce menu, adapté à VOS plats
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              {APP_NAME} part des recettes que votre famille aime déjà, construit le
              plan de batch cooking automatiquement (mise en place groupée, cuissons
              ordonnées), génère la liste de courses et vous guide pas à pas le
              jour&nbsp;J.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-parchment transition-opacity hover:opacity-90"
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/guide/batch-cooking"
                className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-parchment-deep"
              >
                Le guide complet
              </Link>
            </div>
          </Card>
        </section>

        <section>
          <H2>Questions fréquentes</H2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-line bg-parchment-card p-4"
              >
                <summary className="cursor-pointer font-medium text-ink">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-display text-2xl text-ink sm:text-3xl">{children}</h2>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-5 before:absolute before:left-0 before:text-gold before:content-['•']">
      {children}
    </li>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex gap-4">
      <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-soft text-base font-semibold text-ink">
        {n}
      </span>
      <div>
        <h3 className="mb-1 font-display text-xl text-ink">{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
