import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { Faq, GuideCta, GuideJsonLd, H2 } from "../../_components/guide-ui";

const TITLE = "Alternative à Jow : vos recettes, sans supermarché imposé";
const DESCRIPTION =
  "Vous cherchez une alternative à Jow ? Comparatif honnête : recettes, liste de courses, modèle économique, batch cooking et prix. Voyez laquelle des deux applications correspond à votre famille.";
const PUBLISHED = "2026-08-17";
const PATH = "/comparatif/jow";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const ROWS: { critere: string; jow: string; nous: string }[] = [
  { critere: "Recettes", jow: "Catalogue de recettes proposé par l'app", nous: "Vos propres plats : l'IA crée les recettes que votre famille aime déjà, que vous validez" },
  { critere: "Liste de courses", jow: "Commande en un clic chez des enseignes partenaires", nous: "Liste rangée par rayon pour n'importe quel magasin ou drive — aucune enseigne imposée" },
  { critere: "Planning", jow: "Suggestions de repas", nous: "Planning midi / soir sur la semaine ou le mois, manuel ou automatique" },
  { critere: "Batch cooking", jow: "Axé recettes et courses", nous: "Session guidée pas à pas, avec mise en place groupée et minuteurs" },
  { critere: "Partage du foyer", jow: "Compte individuel", nous: "Un foyer partagé entre plusieurs comptes" },
  { critere: "Modèle économique", jow: "Gratuit, financé par des partenariats avec des enseignes", nous: "Abonnement clair, sans publicité" },
  { critere: "Prix", jow: "Gratuit", nous: "Gratuit jusqu'à 30 recettes, puis Premium dès 5 €/mois (annuel)" },
];

const FAQ = [
  {
    q: "Jow est-il payant ?",
    a: "Jow est gratuit pour l'utilisateur. Son modèle repose sur des partenariats avec des enseignes de grande distribution, via lesquelles on peut commander les ingrédients.",
  },
  {
    q: `Quelle alternative à Jow sans publicité ni enseigne imposée ?`,
    a: `${APP_NAME} est pensé comme une application honnête : pas de publicité, pas d'enseigne imposée. La liste de courses est rangée par rayon et s'utilise dans le magasin ou le drive de votre choix. Le modèle est un abonnement clair.`,
  },
  {
    q: `Peut-on utiliser ${APP_NAME} avec n'importe quel supermarché ?`,
    a: "Oui. La liste de courses est générée par rayon et reste indépendante de toute enseigne : vous faites vos courses où vous voulez, en magasin comme en drive.",
  },
  {
    q: `Faut-il changer ses habitudes de recettes ?`,
    a: `Non, c'est justement l'idée : ${APP_NAME} part des plats que votre famille aime déjà plutôt que de vous imposer un catalogue.`,
  },
];

export default function ComparatifJowPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />

      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>{" "}
        <span aria-hidden>›</span> Comparatif <span aria-hidden>›</span>{" "}
        <span className="text-ink">Alternative à Jow</span>
      </nav>

      <header className="mb-8">
        <p className="eyebrow mb-2">Comparatif</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Alternative à Jow&nbsp;: vos recettes, sans supermarché imposé
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Jow et {APP_NAME} répondent au même besoin — que manger cette
          semaine&nbsp;? — mais avec deux philosophies différentes. Voici une
          comparaison honnête pour choisir celle qui vous convient.
        </p>
      </header>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-soft">
                <th className="py-2 pr-3 font-semibold">Critère</th>
                <th className="py-2 pr-3 font-semibold">Jow</th>
                <th className="rounded-t-lg bg-gold-soft/50 px-3 py-2 font-semibold text-ink">
                  {APP_NAME}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.critere} className="border-b border-line/60 align-top">
                  <td className="py-3 pr-3 font-medium text-ink">{r.critere}</td>
                  <td className="py-3 pr-3 text-ink-soft">{r.jow}</td>
                  <td className="bg-gold-soft/25 px-3 py-3 text-ink">{r.nous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-12 space-y-10 text-ink-soft">
        <section>
          <H2>Ce que Jow fait très bien</H2>
          <p>
            Soyons justes&nbsp;: Jow est une très bonne application, gratuite,
            avec une large base de recettes et un vrai atout — commander tous les
            ingrédients d&rsquo;un repas en un clic chez une enseigne partenaire.
            Si votre priorité est de <strong className="text-ink">gagner du
            temps sur la commande de courses</strong> chez une grande enseigne,
            Jow est taillé pour ça.
          </p>
        </section>

        <section>
          <H2>Pour qui&nbsp;?</H2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <h3 className="mb-2 font-display text-xl text-ink">Choisissez Jow si…</h3>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                <li>vous voulez commander vos courses en un clic chez une enseigne partenaire&nbsp;;</li>
                <li>vous aimez découvrir des recettes proposées par l&rsquo;app&nbsp;;</li>
                <li>la gratuité prime, partenariats enseignes compris.</li>
              </ul>
            </Card>
            <Card className="border-gold/40 bg-gold-soft/20 p-5">
              <h3 className="mb-2 font-display text-xl text-ink">Choisissez {APP_NAME} si…</h3>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                <li>vous voulez cuisiner <strong className="text-ink">vos</strong> plats, pas un catalogue imposé&nbsp;;</li>
                <li>vous faites vos courses où vous voulez (tout magasin, tout drive)&nbsp;;</li>
                <li>vous voulez du batch cooking guidé et un foyer partagé, sans publicité.</li>
              </ul>
            </Card>
          </div>
        </section>

        <GuideCta
          title={`Essayez ${APP_NAME} gratuitement`}
          text="Vos recettes, un planning partagé, une liste de courses automatique et le batch cooking guidé — sans publicité ni enseigne imposée. Gratuit jusqu'à 30 recettes."
          secondaryHref="/tarifs"
          secondaryLabel="Voir les offres"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
