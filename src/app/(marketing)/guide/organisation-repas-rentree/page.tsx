import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2 } from "../../_components/guide-ui";

const TITLE = "Organiser les repas de la semaine pour la rentrée (sans stress)";
const DESCRIPTION =
  "La rentrée, c'est les agendas qui se remplissent et le « on mange quoi ce soir ? » qui revient chaque jour. Voici une méthode simple pour organiser les repas de la semaine en famille : menu type, batch cooking du dimanche, liste de courses automatique et charge mentale allégée.";
const PUBLISHED = "2026-09-01";
const PATH = "/guide/organisation-repas-rentree";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const SEMAINE: { jour: string; plat: string; astuce: string }[] = [
  { jour: "Lundi", plat: "Pâtes bolognaise", astuce: "La sauce a été préparée dimanche (batch) → 10 min ce soir." },
  { jour: "Mardi", plat: "Riz cantonais vide-frigo", astuce: "On recycle les restes du week-end (riz, légumes, jambon)." },
  { jour: "Mercredi", plat: "Poulet rôti & légumes au four", astuce: "Journée chargée : le four cuit tout seul, mains libres." },
  { jour: "Jeudi", plat: "Soupe complète + croque-monsieur", astuce: "Rapide et réconfortant les soirs d'école." },
  { jour: "Vendredi", plat: "Tacos ou pizza maison", astuce: "Repas convivial pour lancer le week-end, les enfants participent." },
  { jour: "Samedi", plat: "Gratin (lasagnes ou parmentier)", astuce: "On en fait deux : un pour ce soir, un au congélateur." },
  { jour: "Dimanche", plat: "Repas « plaisir » + session batch", astuce: "On cuisine tranquillement et on prépare les bases de la semaine." },
];

const ETAPES: { emoji: string; titre: string; corps: React.ReactNode }[] = [
  {
    emoji: "🗓️",
    titre: "1. Poser un « menu type » de la rentrée",
    corps: (
      <>
        Plutôt que de réinventer chaque semaine, attribuez un <strong className="text-ink">thème
        à chaque jour</strong> (lundi rapide, mardi vide-frigo, mercredi au four, jeudi soupe,
        vendredi convivial…). Vous ne cherchez plus « une idée » dans le vide : vous piochez dans
        le thème du jour. C&rsquo;est toute la méthode du{" "}
        <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
          menu de la semaine
        </Link>
        .
      </>
    ),
  },
  {
    emoji: "🍲",
    titre: "2. Cuisiner d'avance le dimanche",
    corps: (
      <>
        Une seule session de <strong className="text-ink">batch cooking</strong> le dimanche
        (sauce tomate, légumes rôtis, une base de féculents, une protéine) et les soirs de semaine
        deviennent de simples assemblages de 10 minutes. Notre{" "}
        <Link href="/guide/batch-cooking" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
          guide du batch cooking
        </Link>{" "}
        et le{" "}
        <Link href="/guide/menu-batch-cooking-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
          menu batch cooking d&rsquo;une semaine
        </Link>{" "}
        détaillent la marche à suivre.
      </>
    ),
  },
  {
    emoji: "🛒",
    titre: "3. Une liste de courses qui se remplit toute seule",
    corps: (
      <>
        Une fois le menu posé, la{" "}
        <Link href="/liste-de-courses" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
          liste de courses
        </Link>{" "}
        se déduit automatiquement : plus d&rsquo;oubli, plus d&rsquo;allers-retours au magasin, et
        un vrai gain de temps pour une semaine de rentrée déjà bien remplie.
      </>
    ),
  },
  {
    emoji: "🧠",
    titre: "4. Alléger la charge mentale",
    corps: (
      <>
        Décider une fois pour toute la semaine, c&rsquo;est se libérer de la question quotidienne
        « on mange quoi ce soir ? » qui pèse surtout à la rentrée. C&rsquo;est le cœur de notre
        guide sur la{" "}
        <Link href="/guide/charge-mentale-repas" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
          charge mentale des repas
        </Link>
        .
      </>
    ),
  },
];

const FAQ = [
  {
    q: "Combien de temps faut-il pour organiser les repas de la semaine ?",
    a: "Une fois votre menu type posé, comptez 10 à 15 minutes le week-end pour choisir les plats de la semaine et générer la liste de courses. La première fois est un peu plus longue ; ensuite, tout roule.",
  },
  {
    q: "Faut-il obligatoirement faire du batch cooking pour la rentrée ?",
    a: "Non, mais c'est le meilleur allié des soirs d'école. Même une mini-session (une sauce et une base de légumes le dimanche) suffit à transformer les repas de semaine en assemblages rapides.",
  },
  {
    q: "Comment gérer les activités et horaires irréguliers de la rentrée ?",
    a: "Placez les plats « mains libres » (au four, en cocotte) les jours chargés, et les plats express les soirs serrés. Prévoir un ou deux plats au congélateur sert de filet de sécurité les soirs imprévus.",
  },
  {
    q: "Comment éviter de manger toujours la même chose ?",
    a: "Gardez une banque d'une vingtaine de plats et faites-les tourner par thème. Piochez dans nos idées de repas pour la semaine pour renouveler facilement le menu.",
  },
];

export default function RentreePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Organiser les repas de la rentrée" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Spécial rentrée</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Organiser les repas de la semaine pour la rentrée
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Cartable, activités, réunions… et le «&nbsp;on mange quoi ce soir&nbsp;?&nbsp;» qui
          revient chaque jour. Voici une méthode simple pour reprendre la main sur les repas de la
          famille dès la rentrée — sans y passer vos soirées.
        </p>
      </header>

      <div className="space-y-6">
        {ETAPES.map((e) => (
          <Card key={e.titre} className="p-5">
            <h2 className="mb-2 font-display text-xl text-ink">
              <span className="mr-2" aria-hidden>{e.emoji}</span>
              {e.titre}
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft">{e.corps}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 space-y-10 text-ink-soft">
        <section>
          <H2>Un exemple de semaine de rentrée</H2>
          <p className="mb-4">
            Voici une semaine type pensée pour les soirs d&rsquo;école&nbsp;: des plats rapides ou
            «&nbsp;mains libres&nbsp;» en semaine, un peu de batch le dimanche, et deux plats faits
            en double pour le congélateur.
          </p>
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-line/60">
              {SEMAINE.map((s) => (
                <li key={s.jour} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="w-24 shrink-0 font-semibold text-ink">{s.jour}</span>
                  <span className="text-ink">{s.plat}</span>
                  <span className="text-xs text-ink-soft sm:ml-auto sm:text-right">{s.astuce}</span>
                </li>
              ))}
            </ul>
          </Card>
          <p className="mt-4 text-sm">
            Besoin d&rsquo;inspiration pour remplir les cases&nbsp;? Piochez dans notre banque d&rsquo;
            <Link href="/guide/idees-repas-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              idées de repas pour la semaine
            </Link>
            .
          </p>
        </section>

        <GuideCta
          title="Laissez l'app organiser votre rentrée"
          text="Dites-nous les plats que votre famille aime : le planning de la semaine se remplit tout seul en respectant vos goûts et allergies, et la liste de courses suit automatiquement. De quoi aborder la rentrée l'esprit léger."
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
