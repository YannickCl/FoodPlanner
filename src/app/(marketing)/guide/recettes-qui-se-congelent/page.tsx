import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2, Li, Step } from "../../_components/guide-ui";

const TITLE = "Recettes qui se congèlent : quoi congeler (et quoi éviter)";
const DESCRIPTION =
  "Quels plats se congèlent bien et lesquels éviter, pour un batch cooking réussi : la liste des recettes qui supportent la congélation, comment les conditionner, congeler et décongeler sans risque.";
const PUBLISHED = "2026-08-17";
const PATH = "/guide/recettes-qui-se-congelent";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const OUI = [
  "Soupes et veloutés",
  "Plats mijotés (chili, bœuf bourguignon, curry)",
  "Sauces (tomate, bolognaise)",
  "Légumineuses cuites (lentilles, pois chiches)",
  "Gratins et lasagnes",
  "Riz et céréales cuits (refroidis vite)",
  "Pain, brioches, pâtes à tarte crues",
  "Viandes et poissons cuits en sauce",
  "Purées de légumes",
  "Crêpes et galettes",
];

const NON = [
  "Salades et crudités (elles rendent de l'eau)",
  "Pommes de terre en morceaux (deviennent farineuses)",
  "Fritures (perdent tout leur croustillant)",
  "Œufs durs et blancs montés",
  "Sauces à base de crème ou d'œuf (elles tranchent)",
  "Fromages frais et yaourts",
  "Fruits et légumes à forte teneur en eau (concombre, salade)",
  "Pâtes trop cuites (deviennent molles)",
];

const FAQ = [
  {
    q: "Combien de temps un plat se conserve-t-il au congélateur ?",
    a: "La plupart des plats cuisinés se gardent 1 à 3 mois au congélateur. Étiquetez toujours avec la date : passé ce délai, le plat reste comestible mais perd en goût et en texture.",
  },
  {
    q: "Comment décongeler sans risque ?",
    a: "Idéalement au réfrigérateur, la veille pour le lendemain — jamais à température ambiante sur le plan de travail. Vous pouvez aussi réchauffer directement à la casserole ou au four pour les soupes et mijotés.",
  },
  {
    q: "Peut-on recongeler un plat décongelé ?",
    a: "Non. On ne recongèle jamais un aliment déjà décongelé. Congelez en portions individuelles pour ne sortir que ce dont vous avez besoin.",
  },
];

export default function RecettesCongelentPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Recettes qui se congèlent" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Batch cooking · conservation</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Les recettes qui se congèlent (et celles à éviter)
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          La congélation est l&rsquo;alliée du batch cooking&nbsp;: elle prolonge
          vos préparations bien au-delà de 3-4 jours. Encore faut-il savoir ce
          qui la supporte — et ce qui ne la supporte pas.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 font-display text-xl text-green">✅ Se congèle très bien</h2>
          <ul className="space-y-1.5 text-sm text-ink">
            {OUI.map((x) => (
              <li key={x} className="relative pl-4 before:absolute before:left-0 before:text-green before:content-['✓']">
                {x}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 font-display text-xl text-brick">⛔ À éviter</h2>
          <ul className="space-y-1.5 text-sm text-ink">
            {NON.map((x) => (
              <li key={x} className="relative pl-4 before:absolute before:left-0 before:text-brick before:content-['✕']">
                {x}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-12 space-y-10 text-ink-soft">
        <section>
          <H2>Bien congeler, étape par étape</H2>
          <Step n={1} title="Refroidir rapidement">
            Ne congelez jamais un plat encore chaud. Laissez-le refroidir moins de
            2&nbsp;h à température ambiante, puis placez-le au congélateur.
          </Step>
          <Step n={2} title="Portionner">
            Congelez en portions individuelles ou familiales&nbsp;: vous ne sortez
            que ce qu&rsquo;il faut, sans avoir à recongeler le reste.
          </Step>
          <Step n={3} title="Bien conditionner">
            Boîtes hermétiques ou sacs de congélation, en chassant l&rsquo;air.
            Laissez un peu d&rsquo;espace pour les liquides (ils gonflent en gelant).
          </Step>
          <Step n={4} title="Étiqueter">
            Nom du plat + date. Sans étiquette, on ne sait plus, donc on jette —
            et tout le bénéfice du batch cooking disparaît.
          </Step>
        </section>

        <section>
          <H2>Congélation & batch cooking</H2>
          <p className="mb-3">
            En pratique, on mange les plats les plus fragiles (poulet rôti, riz,
            légumes) en début de semaine, au frigo, et on congèle les plats
            robustes (mijotés, soupes, sauces) pour la fin de semaine ou les
            semaines suivantes.
          </p>
          <ul className="ml-1 space-y-2">
            <Li>
              Pour la méthode complète, voyez le{" "}
              <Link href="/guide/batch-cooking" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
                guide du batch cooking
              </Link>
              .
            </Li>
            <Li>
              Pour un plan tout prêt&nbsp;: notre{" "}
              <Link href="/guide/menu-batch-cooking-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
                menu batch d&rsquo;une semaine
              </Link>
              .
            </Li>
          </ul>
        </section>

        <GuideCta
          title="Le batch cooking, guidé de A à Z"
          text="L'app construit le plan de préparation, ordonne les cuissons et suit la conservation : vous savez toujours quoi réchauffer et quand."
          secondaryHref="/batch-cooking"
          secondaryLabel="Découvrir le batch cooking"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
