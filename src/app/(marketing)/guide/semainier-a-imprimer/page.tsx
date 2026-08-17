import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { PrintButton } from "../../_components/PrintButton";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2, Li } from "../../_components/guide-ui";

const TITLE = "Semainier de repas à imprimer (gratuit)";
const DESCRIPTION =
  "Un semainier de repas vierge à imprimer gratuitement : une grille midi / soir pour les 7 jours, plus une liste de courses à remplir. Idéal pour planifier les repas de la famille sur papier.";
const PUBLISHED = "2026-08-17";
const PATH = "/guide/semainier-a-imprimer";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const RAYONS = ["Fruits & légumes", "Boucherie / Poisson", "Épicerie", "Crémerie & œufs"];

const FAQ = [
  {
    q: "Le semainier est-il vraiment gratuit ?",
    a: "Oui. Cliquez sur « Imprimer / Enregistrer en PDF » : vous pouvez l'imprimer autant de fois que vous voulez, ou l'enregistrer en PDF pour le réutiliser chaque semaine.",
  },
  {
    q: "Comment bien utiliser un semainier ?",
    a: "Remplissez-le une fois par semaine, au calme : notez d'abord les soirs contraints (activités, sorties), puis complétez avec vos plats. Déduisez-en la liste de courses dans la foulée.",
  },
  {
    q: "Existe-t-il une version qui remplit la liste de courses automatiquement ?",
    a: `Oui : ${APP_NAME} planifie les repas et génère la liste de courses toute seule, rangée par rayon. Le papier est parfait pour commencer ; l'app fait gagner du temps sur la durée.`,
  },
];

export default function SemainierPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Semainier à imprimer" />

      <header className="no-print mb-6">
        <p className="eyebrow mb-2">À imprimer · gratuit</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Semainier de repas à imprimer
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Une grille vierge midi / soir pour les 7 jours, et une liste de courses
          à remplir. Imprimez-la, accrochez-la sur le frigo, et ne subissez plus
          le « on mange quoi ce soir&nbsp;? ».
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

      {/* ---- Bloc imprimable ---- */}
      <section className="print-area space-y-6">
        <div className="hidden print:block">
          <h2 className="font-display text-2xl text-ink">Semainier de repas</h2>
          <p className="text-sm text-ink-soft">Semaine du __ / __ · {APP_NAME}</p>
        </div>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-2xl text-ink">Ma semaine</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink-soft">
                  <th className="w-28 py-2 pr-3 font-semibold">Jour</th>
                  <th className="py-2 pr-3 font-semibold">Midi</th>
                  <th className="py-2 font-semibold">Soir</th>
                </tr>
              </thead>
              <tbody>
                {JOURS.map((j) => (
                  <tr key={j} className="border-b border-line/60">
                    <td className="py-5 pr-3 align-top font-medium text-ink">{j}</td>
                    <td className="border-l border-line/60 py-5 pr-3">&nbsp;</td>
                    <td className="border-l border-line/60 py-5">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-2xl text-ink">Ma liste de courses</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {RAYONS.map((r) => (
              <div key={r}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
                  {r}
                </p>
                <ul className="space-y-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center gap-2 border-b border-line/60 pb-2 text-ink-soft">
                      <span aria-hidden>☐</span>
                      <span>&nbsp;</span>
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
          <H2>Comment bien s&rsquo;en servir</H2>
          <ul className="ml-1 space-y-2">
            <Li>Remplissez-le une fois par semaine, au calme — pas chaque soir dans l&rsquo;urgence.</Li>
            <Li>Notez d&rsquo;abord les soirs contraints (activités, sorties), puis complétez.</Li>
            <Li>Piochez dans vos plats habituels plutôt que de chercher l&rsquo;inspiration à zéro.</Li>
            <Li>Reportez les ingrédients manquants directement dans la liste de courses.</Li>
          </ul>
          <p className="mt-4">
            Pour la méthode complète, voyez notre{" "}
            <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              guide du menu de la semaine
            </Link>
            .
          </p>
        </section>

        <GuideCta
          title="Et si la liste se remplissait toute seule ?"
          text={`${APP_NAME} transforme votre semainier en version numérique : planning partagé avec le foyer, liste de courses automatique rangée par rayon, et rappels au bon moment.`}
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
