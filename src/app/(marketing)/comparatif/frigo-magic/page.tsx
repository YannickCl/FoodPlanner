import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { Faq, GuideCta, GuideJsonLd, H2 } from "../../_components/guide-ui";

const TITLE = "Alternative à Frigo Magic : planifier sa semaine, pas seulement vider le frigo";
const DESCRIPTION =
  "Vous cherchez une alternative à Frigo Magic ? Comparatif honnête : anti-gaspi, recettes, planning de la semaine, liste de courses, batch cooking et prix. Laquelle correspond à votre organisation ?";
const PUBLISHED = "2026-09-01";
const PATH = "/comparatif/frigo-magic";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const ROWS: { critere: string; eux: string; nous: string }[] = [
  { critere: "Point de départ", eux: "Ce qu'il reste dans votre frigo, ici et maintenant", nous: "Le menu de la semaine, planifié à l'avance" },
  { critere: "Objectif principal", eux: "Anti-gaspillage : cuisiner l'existant", nous: "S'organiser sur la semaine et supprimer la charge mentale" },
  { critere: "Recettes", eux: "Recettes proposées selon vos ingrédients", nous: "Vos propres plats : l'IA crée les recettes que votre famille aime, que vous validez" },
  { critere: "Planning", eux: "Repas au coup par coup", nous: "Planning midi / soir sur la semaine ou le mois, manuel ou automatique" },
  { critere: "Liste de courses", eux: "Complète les ingrédients manquants", nous: "Liste complète rangée par rayon, pour tout magasin ou drive" },
  { critere: "Batch cooking", eux: "Non centré là-dessus", nous: "Session guidée pas à pas, mise en place groupée et minuteurs" },
  { critere: "Partage du foyer", eux: "Compte individuel", nous: "Un foyer partagé entre plusieurs comptes" },
  { critere: "Prix", eux: "Gratuit avec version premium", nous: "Gratuit jusqu'à 30 recettes, puis Premium dès 5 €/mois (annuel)" },
];

const FAQ = [
  {
    q: "À quoi sert Frigo Magic ?",
    a: "Frigo Magic est une application anti-gaspillage : vous indiquez ce que vous avez dans le frigo et les placards, et elle vous propose des recettes pour cuisiner ces ingrédients. Son point fort est d'éviter le gaspillage au jour le jour.",
  },
  {
    q: `Quelle différence avec ${APP_NAME} ?`,
    a: `Frigo Magic part de l'existant pour improviser un repas maintenant ; ${APP_NAME} part de votre menu de la semaine planifié à l'avance, à partir des plats que votre famille aime. L'un règle le « j'ai ça, je fais quoi ? », l'autre le « on mange quoi cette semaine ? » et la liste de courses qui va avec.`,
  },
  {
    q: "Peut-on utiliser les deux approches ?",
    a: `Oui, elles sont complémentaires. Beaucoup de familles planifient leur semaine avec ${APP_NAME} et gardent un réflexe anti-gaspi pour improviser avec les restes en fin de semaine.`,
  },
  {
    q: `${APP_NAME} aide-t-il aussi à limiter le gaspillage ?`,
    a: "Oui, indirectement mais efficacement : en planifiant les repas et en générant une liste de courses précise par rayon, on achète le juste nécessaire — ce qui réduit fortement le gaspillage à la source.",
  },
];

export default function ComparatifFrigoMagicPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />

      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>{" "}
        <span aria-hidden>›</span> Comparatif <span aria-hidden>›</span>{" "}
        <span className="text-ink">Alternative à Frigo Magic</span>
      </nav>

      <header className="mb-8">
        <p className="eyebrow mb-2">Comparatif</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Alternative à Frigo Magic&nbsp;: planifier, pas seulement vider le frigo
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Frigo Magic et {APP_NAME} partent de deux logiques opposées&nbsp;: cuisiner
          ce qu&rsquo;on a <em>maintenant</em>, ou planifier la semaine <em>à
          l&rsquo;avance</em>. Voici un comparatif honnête pour choisir selon votre
          organisation.
        </p>
      </header>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-soft">
                <th className="py-2 pr-3 font-semibold">Critère</th>
                <th className="py-2 pr-3 font-semibold">Frigo Magic</th>
                <th className="rounded-t-lg bg-gold-soft/50 px-3 py-2 font-semibold text-ink">
                  {APP_NAME}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.critere} className="border-b border-line/60 align-top">
                  <td className="py-3 pr-3 font-medium text-ink">{r.critere}</td>
                  <td className="py-3 pr-3 text-ink-soft">{r.eux}</td>
                  <td className="bg-gold-soft/25 px-3 py-3 text-ink">{r.nous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-12 space-y-10 text-ink-soft">
        <section>
          <H2>Ce que Frigo Magic fait très bien</H2>
          <p>
            Frigo Magic est excellent sur son terrain&nbsp;: l&rsquo;
            <strong className="text-ink">anti-gaspillage du quotidien</strong>. Quand
            il vous reste des ingrédients disparates et que vous ne savez qu&rsquo;en
            faire, il propose une recette adaptée en quelques secondes. Pour improviser
            et ne rien jeter, c&rsquo;est un vrai bon réflexe.
          </p>
        </section>

        <section>
          <H2>Pour qui&nbsp;?</H2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <h3 className="mb-2 font-display text-xl text-ink">Choisissez Frigo Magic si…</h3>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                <li>vous voulez surtout cuisiner ce que vous avez déjà&nbsp;;</li>
                <li>vous improvisez au jour le jour, sans planifier&nbsp;;</li>
                <li>votre priorité est l&rsquo;anti-gaspillage immédiat.</li>
              </ul>
            </Card>
            <Card className="border-gold/40 bg-gold-soft/20 p-5">
              <h3 className="mb-2 font-display text-xl text-ink">Choisissez {APP_NAME} si…</h3>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                <li>vous voulez <strong className="text-ink">planifier</strong> la semaine et en finir avec le « on mange quoi&nbsp;?&nbsp;»&nbsp;;</li>
                <li>vous voulez une liste de courses complète, par rayon&nbsp;;</li>
                <li>vous cuisinez vos plats, avec batch cooking guidé et foyer partagé.</li>
              </ul>
            </Card>
          </div>
        </section>

        <GuideCta
          title={`Essayez ${APP_NAME} gratuitement`}
          text="Planifiez la semaine à partir de vos plats, avec une liste de courses automatique et le batch cooking guidé. Gratuit jusqu'à 30 recettes."
          secondaryHref="/comparatif/jow"
          secondaryLabel="Voir aussi : alternative à Jow"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
