import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2, Li } from "../../_components/guide-ui";

const TITLE = "Menu de la semaine pas cher : bien manger à petit budget";
const DESCRIPTION =
  "Un menu de la semaine pas cher pour la famille : les stratégies pour réduire le budget courses (légumineuses, saison, anti-gaspi, batch), un exemple de menu petit budget sur 7 jours et des astuces concrètes.";
const PUBLISHED = "2026-08-18";
const PATH = "/guide/menu-semaine-pas-cher";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const MENU: { jour: string; plat: string }[] = [
  { jour: "Lundi", plat: "Soupe de légumes maison + tartines gratinées" },
  { jour: "Mardi", plat: "Pâtes à la sauce tomate maison" },
  { jour: "Mercredi", plat: "Dahl de lentilles et riz" },
  { jour: "Jeudi", plat: "Omelette et pommes de terre sautées" },
  { jour: "Vendredi", plat: "Gratin de légumes de saison" },
  { jour: "Samedi", plat: "Chili sin carne (haricots rouges)" },
  { jour: "Dimanche", plat: "Poulet rôti et légumes (restes pour lundi)" },
];

const FAQ = [
  {
    q: "Comment réduire son budget courses ?",
    a: "Le plus efficace est de planifier : on achète selon une liste précise, on évite les achats impulsifs et on gaspille beaucoup moins. Ajoutez des repas à base de légumineuses, cuisinez maison et achetez de saison.",
  },
  {
    q: "Quels aliments pas chers privilégier ?",
    a: "Les légumineuses (lentilles, pois chiches, haricots), les œufs, les pâtes et le riz, les légumes de saison, et les morceaux de viande économiques. Un poulet entier rôti revient moins cher que des filets et sert plusieurs repas.",
  },
  {
    q: "Manger pas cher, est-ce forcément moins équilibré ?",
    a: "Non, au contraire : les légumineuses et les légumes de saison sont à la fois économiques et sains. Un menu petit budget bien pensé est souvent plus équilibré qu'un panier d'aliments transformés.",
  },
];

export default function MenuPasCherPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Menu pas cher" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Petit budget</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Menu de la semaine pas cher
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Bien manger sans exploser le budget, c&rsquo;est surtout une question
          d&rsquo;organisation. Voici les leviers qui comptent et un menu
          d&rsquo;exemple à petit prix pour toute la famille.
        </p>
      </header>

      <div className="space-y-10 text-ink-soft">
        <section>
          <H2>Les leviers qui font baisser la facture</H2>
          <ul className="ml-1 space-y-2">
            <Li><strong className="text-ink">Planifier.</strong> Un menu établi = des courses ciblées, moins d&rsquo;achats impulsifs et moins de gaspillage.</Li>
            <Li><strong className="text-ink">Miser sur les légumineuses.</strong> Lentilles, pois chiches, haricots&nbsp;: nourrissants, sains et très bon marché.</Li>
            <Li><strong className="text-ink">Cuisiner de saison.</strong> Les fruits et légumes de saison coûtent nettement moins cher.</Li>
            <Li><strong className="text-ink">Anti-gaspi.</strong> Prévoyez un repas «&nbsp;vide-frigo&nbsp;» et recyclez les restes.</Li>
            <Li><strong className="text-ink">Cuisiner en grande quantité.</strong> Le batch cooking amortit les ingrédients et le temps.</Li>
          </ul>
        </section>

        <section>
          <H2>Un menu petit budget sur 7 jours</H2>
          <Card className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-ink-soft">
                    <th className="py-2 pr-3 font-semibold">Jour</th>
                    <th className="py-2 font-semibold">Dîner</th>
                  </tr>
                </thead>
                <tbody>
                  {MENU.map((m) => (
                    <tr key={m.jour} className="border-b border-line/60 align-top">
                      <td className="py-2 pr-3 font-medium text-ink">{m.jour}</td>
                      <td className="py-2 text-ink">{m.plat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="mt-3 text-sm">
            Beaucoup d&rsquo;ingrédients se recoupent (tomates, oignons, légumes
            de saison), ce qui limite les achats et le gaspillage.
          </p>
        </section>

        <section>
          <H2>Aller plus loin</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              Préparez ce menu en une fois avec le{" "}
              <Link href="/guide/batch-cooking" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
                batch cooking
              </Link>
              .
            </Li>
            <Li>
              Structurez votre semaine avec le{" "}
              <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
                guide du menu de la semaine
              </Link>
              .
            </Li>
          </ul>
        </section>

        <GuideCta
          title="Maîtrisez votre budget repas"
          text="Planifiez vos repas et laissez la liste de courses se construire toute seule : vous achetez juste ce qu'il faut, sans gaspiller."
          secondaryHref="/liste-de-courses"
          secondaryLabel="La liste de courses automatique"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
