import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import { PrintButton } from "../../_components/PrintButton";
import { Faq, GuideCta, H2, Li, Step } from "../../_components/guide-ui";

const TITLE = "Menu végétarien de la semaine (7 dîners + liste de courses)";
const DESCRIPTION =
  "Un menu végétarien complet pour une semaine : 7 dîners équilibrés pour une famille, la liste de courses par rayon à imprimer, et la méthode pour composer des repas sans viande qui tiennent au corps.";
const PUBLISHED = "2026-09-01";
const URL_PATH = "/guide/menu-vegetarien-semaine";

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

// Le menu végétarien de la semaine (7 dîners, famille de 4).
const MENU: { jour: string; plat: string; proteine: string }[] = [
  { jour: "Lundi", plat: "Dahl de lentilles corail & riz", proteine: "Lentilles corail" },
  { jour: "Mardi", plat: "Chili sin carne (haricots rouges, maïs) + riz", proteine: "Haricots rouges" },
  { jour: "Mercredi", plat: "Gratin de pâtes aux légumes & mozzarella", proteine: "Œufs, fromage" },
  { jour: "Jeudi", plat: "Buddha bowl : quinoa, pois chiches rôtis, houmous", proteine: "Pois chiches" },
  { jour: "Vendredi", plat: "Galettes de lentilles & poêlée de légumes", proteine: "Lentilles vertes" },
  { jour: "Samedi", plat: "Pizza maison légumes & œuf, ou tarte fine", proteine: "Œufs, fromage" },
  { jour: "Dimanche", plat: "Soupe de légumes + omelette aux herbes", proteine: "Œufs" },
];

// Liste de courses par rayon (famille de 4, semaine végétarienne).
const COURSES: { rayon: string; items: string[] }[] = [
  {
    rayon: "Fruits & légumes",
    items: [
      "4 oignons",
      "1 tête d'ail",
      "1 morceau de gingembre",
      "5 carottes",
      "2 courgettes",
      "2 poivrons",
      "1 aubergine",
      "500 g de tomates (ou 1 boîte concassée en plus)",
      "1 brocoli ou chou-fleur",
      "1 salade + crudités",
      "1 bouquet de coriandre + persil",
    ],
  },
  {
    rayon: "Épicerie",
    items: [
      "250 g de lentilles corail",
      "250 g de lentilles vertes",
      "500 g de riz",
      "250 g de quinoa",
      "500 g de pâtes",
      "2 boîtes de pois chiches",
      "2 boîtes de haricots rouges",
      "1 boîte de maïs",
      "3 boîtes de tomates concassées",
      "1 brique de lait de coco",
      "1 pot de houmous (ou tahin pour le faire)",
      "Farine + levure (pizza / galettes)",
      "Huile d'olive",
      "Épices : curry, cumin, paprika, curcuma",
    ],
  },
  {
    rayon: "Crémerie & œufs",
    items: [
      "1 boule de mozzarella",
      "200 g de fromage râpé (emmental / comté)",
      "1 morceau de parmesan",
      "12 œufs",
      "1 yaourt nature (sauce bowl, facultatif)",
    ],
  },
  {
    rayon: "Boulangerie",
    items: ["1 pain de campagne (soupe & tartines)"],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Un menu végétarien apporte-t-il assez de protéines ?",
    a: "Oui, à condition de mettre une source de protéines végétales à chaque repas : lentilles, pois chiches, haricots, tofu, ou des œufs et du fromage. En associant légumineuses et céréales (riz, pâtes, quinoa) sur la journée, on couvre facilement les besoins d'une famille.",
  },
  {
    q: "Ce menu végétarien est-il adapté aux enfants ?",
    a: "Oui. Le gratin de pâtes, le chili doux, les galettes de lentilles et la pizza maison plaisent généralement aux enfants. Pour les plats épicés comme le dahl ou le chili, dosez les épices légèrement et servez à part ce qui pique.",
  },
  {
    q: "Peut-on préparer ce menu à l'avance (batch cooking) ?",
    a: "Tout à fait. Le dahl, le chili sin carne et la soupe se préparent en grande quantité et se congèlent très bien. Les pois chiches rôtis, les galettes et le quinoa se gardent 3-4 jours au frigo. Une session de 2 h le dimanche couvre l'essentiel de la semaine.",
  },
  {
    q: "Combien coûte une semaine de repas végétariens ?",
    a: "C'est souvent l'une des façons les plus économiques de manger : les légumineuses sèches ou en boîte coûtent bien moins cher que la viande. Ce menu pour une famille de 4 revient généralement moins cher qu'une semaine classique.",
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

export default function MenuVegetarienSemainePage() {
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
        <span className="text-ink">Menu végétarien de la semaine</span>
      </nav>

      <header className="no-print mb-8">
        <p className="eyebrow mb-2">Menu prêt à suivre</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Menu végétarien de la semaine
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          7 dîners sans viande, équilibrés et rassasiants pour toute la famille.
          Voici le menu complet, la liste de courses par rayon à imprimer, et la
          méthode pour composer des repas végétariens qui tiennent au corps.
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
            Menu végétarien — une semaine
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
                  <th className="py-2 font-semibold">Protéine</th>
                </tr>
              </thead>
              <tbody>
                {MENU.map((m) => (
                  <tr key={m.jour} className="border-b border-line/60 align-top">
                    <td className="py-2 pr-3 font-medium text-ink">{m.jour}</td>
                    <td className="py-2 pr-3 text-ink">{m.plat}</td>
                    <td className="py-2 text-ink-soft">{m.proteine}</td>
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
          <H2>La règle d&rsquo;or d&rsquo;un dîner végétarien qui rassasie</H2>
          <p className="mb-4">
            Un repas sans viande qui cale vraiment tient en trois briques&nbsp;: une{" "}
            <strong className="text-ink">source de protéines végétales</strong>, une{" "}
            <strong className="text-ink">céréale</strong> et des{" "}
            <strong className="text-ink">légumes</strong>. Gardez cette structure en
            tête et vous ne composerez plus jamais une assiette qui laisse sur sa faim.
          </p>
          <Step n={1} title="Une protéine à chaque repas">
            Lentilles, pois chiches, haricots rouges, tofu — ou, si vous n&rsquo;êtes
            pas végétalien, des œufs et du fromage. C&rsquo;est la brique la plus
            souvent oubliée, et celle qui change tout.
          </Step>
          <Step n={2} title="Une céréale pour tenir">
            Riz, pâtes, quinoa, semoule, pain. Associée à une légumineuse, elle forme
            une protéine complète et évite la fringale de 21&nbsp;h.
          </Step>
          <Step n={3} title="Des légumes pour le volume et la couleur">
            Frais, surgelés ou en conserve&nbsp;: peu importe. Ils apportent les
            fibres, les vitamines et la sensation de plénitude.
          </Step>
        </section>

        <section>
          <H2>Préparer ce menu en une session (option batch cooking)</H2>
          <p className="mb-4">
            Ce menu se prête très bien au{" "}
            <Link href="/guide/batch-cooking" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              batch cooking
            </Link>
            . En 2&nbsp;heures le dimanche, vous prenez une belle avance&nbsp;:
          </p>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">À préparer en grande quantité&nbsp;:</strong>{" "}
              le dahl, le chili sin carne et la soupe — ils se congèlent parfaitement.
            </Li>
            <Li>
              <strong className="text-ink">À cuire d&rsquo;avance&nbsp;:</strong> le
              quinoa, le riz et les pois chiches rôtis (3-4 jours au frigo).
            </Li>
            <Li>
              <strong className="text-ink">À garder pour le jour même&nbsp;:</strong>{" "}
              les omelettes, la pizza et les gratins, meilleurs frais.
            </Li>
          </ul>
        </section>

        <GuideCta
          title="Ce menu, adapté à VOS goûts"
          text={`Dites-nous les plats végétariens que votre famille aime : ${APP_NAME} compose le menu de la semaine à votre place, respecte vos envies et vos allergies, et génère la liste de courses par rayon automatiquement.`}
          secondaryHref="/guide/menu-equilibre-semaine"
          secondaryLabel="Composer un menu équilibré"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
