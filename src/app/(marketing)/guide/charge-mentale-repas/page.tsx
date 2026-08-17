import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Charge mentale des repas : en finir avec le « on mange quoi ce soir ? »";
const DESCRIPTION =
  "La charge mentale des repas épuise autant que la cuisine elle-même. Voici pourquoi, et des stratégies concrètes pour l'alléger : décider une fois, se constituer une banque de repas, partager la charge dans le foyer.";
const PUBLISHED = "2026-08-17";
const URL_PATH = "/guide/charge-mentale-repas";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_PATH },
  openGraph: { type: "article", url: URL_PATH, title: TITLE, description: DESCRIPTION },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Qu'est-ce que la charge mentale des repas ?",
    a: "C'est le travail invisible d'organisation qui entoure les repas : penser à ce qu'on va manger, vérifier les stocks, tenir compte des goûts et des allergies de chacun, faire la liste, anticiper les courses. Ce n'est pas la cuisine en elle-même, mais tout ce qui l'accompagne — et ça pèse chaque jour.",
  },
  {
    q: "Comment arrêter de se demander « on mange quoi ce soir » ?",
    a: "En déplaçant la décision : au lieu de choisir chaque soir sous pression, on décide une fois pour la semaine, au calme. Un menu établi à l'avance supprime la question quotidienne — c'est le levier le plus efficace contre cette charge.",
  },
  {
    q: "Comment partager la charge des repas dans le foyer ?",
    a: "En rendant l'organisation visible et partagée : un planning commun que tout le monde peut consulter et modifier, une liste de courses accessible à tous, et une répartition claire des rôles (qui planifie, qui cuisine, qui fait les courses). Ce qui est écrit et partagé cesse de reposer sur une seule tête.",
  },
  {
    q: "Planifier, est-ce que ça n'ajoute pas encore de la charge ?",
    a: "Sur le moment, planifier demande quinze minutes. Mais ces quinze minutes remplacent sept décisions prises en urgence dans la semaine. Le bilan est très positif : on concentre l'effort une fois, au lieu de le subir en continu.",
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

const TOC: { id: string; label: string }[] = [
  { id: "definition", label: "La charge mentale des repas" },
  { id: "pourquoi", label: "Pourquoi ça épuise" },
  { id: "alleger", label: "6 façons de l'alléger" },
  { id: "partager", label: "Partager la charge dans le foyer" },
  { id: "outils", label: "Les outils qui aident" },
  { id: "faq", label: "Questions fréquentes" },
];

export default function GuideChargeMentalePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>{" "}
        <span aria-hidden>›</span> Guide <span aria-hidden>›</span>{" "}
        <span className="text-ink">Charge mentale des repas</span>
      </nav>

      <header className="mb-8">
        <p className="eyebrow mb-2">Guide complet</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          En finir avec le « on mange quoi ce soir&nbsp;? »
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          La charge mentale des repas fatigue autant que la cuisine elle-même.
          Comprendre d&rsquo;où elle vient, c&rsquo;est déjà commencer à
          l&rsquo;alléger. Voici comment reprendre la main, sans culpabiliser.
        </p>
      </header>

      <Card className="mb-10 p-5">
        <h2 className="mb-3 font-display text-lg text-ink">Au sommaire</h2>
        <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
          {TOC.map((t, i) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="text-ink-soft hover:text-ink">
                <span className="num mr-1 text-gold">{i + 1}.</span>
                {t.label}
              </a>
            </li>
          ))}
        </ol>
      </Card>

      <div className="space-y-10 text-ink-soft">
        <section id="definition">
          <H2>La charge mentale des repas, c&rsquo;est quoi&nbsp;?</H2>
          <p className="mb-3">
            La charge mentale, c&rsquo;est le{" "}
            <strong className="text-ink">travail invisible d&rsquo;organisation</strong>{" "}
            qui précède et entoure une tâche. Pour les repas, ce n&rsquo;est pas
            le fait de cuisiner&nbsp;: c&rsquo;est tout ce qui tourne en tête{" "}
            <em>avant</em> de cuisiner.
          </p>
          <p>
            Y penser à l&rsquo;avance, vérifier ce qu&rsquo;il reste dans le
            frigo, se rappeler qui n&rsquo;aime pas quoi, jongler avec une
            allergie, ne pas refaire le même plat que la veille, anticiper les
            courses… Cette part-là est continue, silencieuse, et repose souvent
            sur une seule personne.
          </p>
        </section>

        <section id="pourquoi">
          <H2>Pourquoi «&nbsp;on mange quoi ce soir&nbsp;?&nbsp;» épuise</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">C&rsquo;est quotidien.</strong> La
              question revient chaque jour, souvent au pire moment — fatigué·e,
              pressé·e, en fin de journée.
            </Li>
            <Li>
              <strong className="text-ink">C&rsquo;est de la fatigue décisionnelle.</strong>{" "}
              Décider en urgence, sans cadre, use plus qu&rsquo;on ne le croit.
            </Li>
            <Li>
              <strong className="text-ink">C&rsquo;est invisible.</strong> Comme
              ce travail ne se voit pas, il est rarement reconnu ni partagé.
            </Li>
            <Li>
              <strong className="text-ink">Ça déborde sur le reste.</strong>{" "}
              Faute d&rsquo;anticipation, on finit par improviser, se dépanner,
              gaspiller — puis culpabiliser.
            </Li>
          </ul>
        </section>

        <section id="alleger">
          <H2>6 façons concrètes de l&rsquo;alléger</H2>

          <Step n={1} title="Décider une fois, pas sept fois">
            Le levier le plus puissant&nbsp;: choisir les repas de la semaine{" "}
            <em>en une fois</em>, au calme, plutôt que chaque soir dans
            l&rsquo;urgence. Notre{" "}
            <Link
              href="/guide/menu-de-la-semaine"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              guide du menu de la semaine
            </Link>{" "}
            détaille une méthode en quinze minutes.
          </Step>

          <Step n={2} title="Se constituer une banque de repas">
            Gardez une liste d&rsquo;une vingtaine de plats que la famille aime.
            On ne cherche plus l&rsquo;inspiration à zéro&nbsp;: on pioche. La
            page blanche est ce qui fatigue le plus.
          </Step>

          <Step n={3} title="Utiliser des trames">
            «&nbsp;Lundi rapide, mardi poisson, mercredi végé…&nbsp;»&nbsp;: un
            fil conducteur par jour réduit le nombre de décisions sans enfermer.
          </Step>

          <Step n={4} title="Automatiser la liste de courses">
            Une liste qui se construit toute seule depuis les repas prévus, c&rsquo;est
            une tâche mentale de moins — et plus d&rsquo;oublis ni d&rsquo;allers-retours.
          </Step>

          <Step n={5} title="Baisser le curseur du « parfait »">
            Tous les repas n&rsquo;ont pas à être élaborés. Un plat simple mais
            prévu vaut mieux qu&rsquo;un plat idéal jamais réalisé. S&rsquo;autoriser
            le «&nbsp;assez bon&nbsp;» libère énormément.
          </Step>

          <Step n={6} title="Cuisiner à l'avance quand la semaine est chargée">
            Le{" "}
            <Link
              href="/guide/batch-cooking"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              batch cooking
            </Link>{" "}
            concentre l&rsquo;effort sur une seule session&nbsp;: le reste de la
            semaine, il n&rsquo;y a plus qu&rsquo;à réchauffer.
          </Step>
        </section>

        <section id="partager">
          <H2>Partager la charge dans le foyer</H2>
          <p className="mb-3">
            Alléger, ce n&rsquo;est pas seulement mieux s&rsquo;organiser
            soi-même&nbsp;: c&rsquo;est aussi{" "}
            <strong className="text-ink">cesser de tout porter seul·e</strong>.
            La charge mentale se partage mal tant qu&rsquo;elle reste dans une
            tête. Rendez-la visible&nbsp;:
          </p>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Un planning commun</strong> que
              chacun peut consulter et modifier — pas un savoir dans la tête
              d&rsquo;une seule personne.
            </Li>
            <Li>
              <strong className="text-ink">Une liste de courses partagée</strong>,
              où tout le monde peut ajouter et cocher.
            </Li>
            <Li>
              <strong className="text-ink">Des rôles clairs</strong>&nbsp;: qui
              planifie, qui cuisine, qui fait les courses. Ce qui est écrit et
              réparti cesse de peser sur une seule personne.
            </Li>
          </ul>
        </section>

        <section id="outils">
          <H2>Les outils qui aident vraiment</H2>
          <p>
            Un bon outil ne cuisine pas à votre place&nbsp;: il{" "}
            <strong className="text-ink">sort l&rsquo;organisation de votre tête</strong>.
            {" "}Planning partagé, liste de courses automatique, rappels au bon
            moment, suggestions basées sur vos propres plats — autant de
            décisions et de «&nbsp;il faut penser à…&nbsp;» en moins. C&rsquo;est
            précisément ce pour quoi {APP_NAME} est conçu.
          </p>
        </section>

        <section>
          <Card className="border-gold/40 bg-gold-soft/30 p-6 text-center">
            <h2 className="font-display text-2xl text-ink">
              Reprenez la main sur les repas
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              {APP_NAME} planifie, génère la liste de courses et se partage avec
              tout le foyer. La décision est prise une fois — la charge mentale
              redescend. Gratuit pour commencer.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-parchment transition-opacity hover:opacity-90"
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/guide/menu-de-la-semaine"
                className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-parchment-deep"
              >
                La méthode du menu de la semaine
              </Link>
            </div>
          </Card>
        </section>

        <section id="faq">
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
