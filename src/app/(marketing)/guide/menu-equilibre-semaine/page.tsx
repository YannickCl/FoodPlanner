import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2, Li } from "../../_components/guide-ui";

const TITLE = "Menu de la semaine équilibré pour la famille";
const DESCRIPTION =
  "Comment composer un menu de la semaine équilibré sans se compliquer la vie : le principe de l'assiette, un exemple de menu sur 7 jours et des repères simples (protéines, poisson, végétarien).";
const PUBLISHED = "2026-08-18";
const PATH = "/guide/menu-equilibre-semaine";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const MENU: { jour: string; plat: string; note: string }[] = [
  { jour: "Lundi", plat: "Pâtes complètes, légumes, parmesan", note: "Féculent complet + légumes" },
  { jour: "Mardi", plat: "Poisson blanc, riz, brocolis", note: "Poisson maigre" },
  { jour: "Mercredi", plat: "Dahl de lentilles, épinards", note: "Végétarien (légumineuses)" },
  { jour: "Jeudi", plat: "Poulet, pommes de terre, salade", note: "Volaille" },
  { jour: "Vendredi", plat: "Omelette, ratatouille, pain complet", note: "Œufs + légumes" },
  { jour: "Samedi", plat: "Chili con carne", note: "Viande + légumineuses" },
  { jour: "Dimanche", plat: "Saumon, semoule, courgettes", note: "Poisson gras" },
];

const FAQ = [
  {
    q: "Qu'est-ce qu'un menu de la semaine équilibré ?",
    a: "Un menu qui, sur l'ensemble de la semaine, apporte assez de légumes, alterne les sources de protéines (viande, poisson, œufs, légumineuses) et privilégie les féculents complets. L'équilibre se juge sur les 7 jours, pas à chaque repas.",
  },
  {
    q: "Combien de fois manger du poisson par semaine ?",
    a: "Deux fois par semaine environ, dont un poisson gras (saumon, maquereau, sardine) riche en oméga-3.",
  },
  {
    q: "Faut-il des repas végétariens pour équilibrer ?",
    a: "Ce n'est pas obligatoire, mais un à deux repas végétariens par semaine (à base de légumineuses ou d'œufs) améliorent l'équilibre, coûtent moins cher et varient les plaisirs.",
  },
];

export default function MenuEquilibrePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Menu équilibré" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Menu équilibré</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Un menu de la semaine équilibré, sans prise de tête
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Manger équilibré ne demande ni balance ni calculs. Quelques repères
          simples et un menu pensé sur la semaine suffisent. Voici comment faire.
        </p>
      </header>

      <div className="space-y-10 text-ink-soft">
        <section>
          <H2>Le principe de l&rsquo;assiette</H2>
          <p className="mb-3">
            La règle la plus simple à retenir, repas après repas&nbsp;:
          </p>
          <ul className="ml-1 space-y-2">
            <Li><strong className="text-ink">½ de légumes</strong> (crus ou cuits, de saison)&nbsp;;</Li>
            <Li><strong className="text-ink">¼ de féculents</strong> (idéalement complets)&nbsp;;</Li>
            <Li><strong className="text-ink">¼ de protéines</strong> (viande, poisson, œufs ou légumineuses)&nbsp;;</Li>
            <Li>un fruit et un produit laitier complètent la journée.</Li>
          </ul>
        </section>

        <section>
          <H2>Un exemple de menu équilibré sur 7 jours</H2>
          <Card className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-ink-soft">
                    <th className="py-2 pr-3 font-semibold">Jour</th>
                    <th className="py-2 pr-3 font-semibold">Dîner</th>
                    <th className="py-2 font-semibold">Repère</th>
                  </tr>
                </thead>
                <tbody>
                  {MENU.map((m) => (
                    <tr key={m.jour} className="border-b border-line/60 align-top">
                      <td className="py-2 pr-3 font-medium text-ink">{m.jour}</td>
                      <td className="py-2 pr-3 text-ink">{m.plat}</td>
                      <td className="py-2 text-ink-soft">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="mt-3 text-sm">
            Sur la semaine&nbsp;: 2 poissons (dont un gras), 2 repas
            végétariens, des légumineuses, et des légumes à chaque dîner.
          </p>
        </section>

        <section>
          <H2>Les repères qui suffisent</H2>
          <ul className="ml-1 space-y-2">
            <Li><strong className="text-ink">Variez les protéines</strong> d&rsquo;un jour à l&rsquo;autre plutôt que de manger de la viande tous les soirs.</Li>
            <Li><strong className="text-ink">Des légumes à chaque repas</strong>, de saison quand c&rsquo;est possible.</Li>
            <Li><strong className="text-ink">Des féculents complets</strong> (riz, pâtes, pain) pour la satiété.</Li>
            <Li><strong className="text-ink">La régularité avant la perfection</strong>&nbsp;: un menu prévu vaut mieux qu&rsquo;un menu idéal jamais tenu.</Li>
          </ul>
          <p className="mt-4">
            La clé reste de <strong className="text-ink">planifier</strong>&nbsp;: voyez notre{" "}
            <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              guide du menu de la semaine
            </Link>{" "}
            et nos{" "}
            <Link href="/guide/idees-repas-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              idées de repas
            </Link>
            .
          </p>
        </section>

        <GuideCta
          title="Un menu équilibré, généré selon vos goûts"
          text="Indiquez vos plats et vos contraintes : le planning respecte vos allergies et varie les repas, et la liste de courses suit automatiquement."
          secondaryHref="/planning-repas"
          secondaryLabel="Découvrir le planning"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
