import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Batch cooking : le guide complet pour débuter";
const DESCRIPTION =
  "Le batch cooking, c'est cuisiner en une seule session les repas de toute la semaine. Méthode pas à pas, matériel, conservation, erreurs à éviter et un menu d'exemple pour débuter sereinement.";
const PUBLISHED = "2026-08-17";
const URL_PATH = "/guide/batch-cooking";

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

// Questions fréquentes — servent l'affichage ET le schema FAQPage (rich results).
const FAQ: { q: string; a: string }[] = [
  {
    q: "Le batch cooking, c'est quoi exactement ?",
    a: "Le batch cooking (« cuisiner par lots ») consiste à préparer en une seule session, souvent le week-end, la base de tous les repas de la semaine. On mutualise les courses, les épluchages et les cuissons, puis on conserve au frais ou au congélateur pour n'avoir qu'à assembler ou réchauffer en semaine.",
  },
  {
    q: "Combien de temps faut-il prévoir ?",
    a: "Comptez 2 à 3 heures pour couvrir 4 à 5 dîners, une fois la méthode prise en main. Le gain de temps se fait en semaine : plus de décision « on mange quoi ? » ni de vaisselle quotidienne à rallonge.",
  },
  {
    q: "Combien de temps se conservent les plats ?",
    a: "Au réfrigérateur, la plupart des plats cuisinés se gardent 3 à 4 jours dans une boîte hermétique. Au-delà, congelez : la majorité des plats mijotés, soupes et féculents se conservent 1 à 3 mois au congélateur.",
  },
  {
    q: "Faut-il du matériel spécial pour se lancer ?",
    a: "Non. Des boîtes hermétiques (idéalement en verre), quelques contenants adaptés au congélateur et de quoi étiqueter suffisent pour commencer. Une grande plaque de four et deux ou trois casseroles permettent de faire tourner plusieurs cuissons en parallèle.",
  },
  {
    q: "Le batch cooking, est-ce que ça revient moins cher ?",
    a: "Oui, en général. On achète en fonction d'un plan précis (moins d'achats impulsifs), on mutualise les ingrédients entre recettes et on jette beaucoup moins : le gaspillage alimentaire baisse nettement.",
  },
  {
    q: "Peut-on faire du batch cooking avec des enfants difficiles ?",
    a: "Oui : préparez des bases neutres (féculents, légumes rôtis, protéines) que chacun assemble à sa façon. Vous gardez de la variété sans multiplier les préparations, et les enfants peuvent participer au dressage.",
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
  { id: "definition", label: "Le batch cooking, c'est quoi ?" },
  { id: "pourquoi", label: "Pourquoi s'y mettre" },
  { id: "vs-meal-prep", label: "Batch cooking ou meal prep ?" },
  { id: "materiel", label: "Le matériel utile" },
  { id: "methode", label: "La méthode en 6 étapes" },
  { id: "conservation", label: "Conservation & sécurité" },
  { id: "erreurs", label: "Les erreurs de débutant" },
  { id: "menu", label: "Un menu d'exemple" },
  { id: "faq", label: "Questions fréquentes" },
];

export default function GuideBatchCookingPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Fil d'Ariane léger */}
      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>{" "}
        <span aria-hidden>›</span> Guide <span aria-hidden>›</span>{" "}
        <span className="text-ink">Batch cooking</span>
      </nav>

      <header className="mb-8">
        <p className="eyebrow mb-2">Guide complet</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Batch cooking : le guide complet pour débuter
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Cuisiner une fois, bien manger toute la semaine. Voici la méthode
          complète pour préparer vos repas par lots — sans y passer votre
          dimanche, et même quand vous débutez.
        </p>
      </header>

      {/* Sommaire */}
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

      <div className="prose-guide space-y-10 text-ink-soft">
        <section id="definition">
          <H2>Le batch cooking, c&rsquo;est quoi ?</H2>
          <p>
            Le <strong className="text-ink">batch cooking</strong> — littéralement
            «&nbsp;cuisiner par lots&nbsp;» — consiste à préparer en{" "}
            <strong className="text-ink">une seule session</strong>, généralement
            le week-end, la base de tous les repas de la semaine. Plutôt que de
            cuisiner chaque soir de zéro, vous mutualisez les courses, les
            épluchages et les cuissons, puis vous conservez le tout au frais ou au
            congélateur.
          </p>
          <p>
            Le principe tient en une phrase&nbsp;:{" "}
            <em>on regroupe les tâches identiques</em>. Pendant qu&rsquo;un plat
            mijote, un autre rôtit au four et vous taillez les légumes du suivant.
            En semaine, il ne reste qu&rsquo;à réchauffer ou assembler&nbsp;:
            fini le fameux «&nbsp;on mange quoi ce soir&nbsp;?&nbsp;».
          </p>
        </section>

        <section id="pourquoi">
          <H2>Pourquoi s&rsquo;y mettre</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Moins de charge mentale.</strong> La
              décision est prise une fois pour toutes. Plus de course contre la
              montre à 19&nbsp;h.
            </Li>
            <Li>
              <strong className="text-ink">Du temps gagné.</strong> 2 à 3&nbsp;h le
              week-end remplacent une heure de cuisine chaque soir.
            </Li>
            <Li>
              <strong className="text-ink">Des économies.</strong> On achète selon
              un plan précis&nbsp;: moins d&rsquo;achats impulsifs, moins de
              gaspillage.
            </Li>
            <Li>
              <strong className="text-ink">Mieux manger.</strong> Quand tout est
              prêt, on cède beaucoup moins au plat industriel ou à la livraison.
            </Li>
          </ul>
        </section>

        <section id="vs-meal-prep">
          <H2>Batch cooking ou meal prep ?</H2>
          <p>
            Les deux se confondent souvent. La nuance&nbsp;: le{" "}
            <strong className="text-ink">meal prep</strong> consiste à préparer des
            portions déjà assemblées et prêtes à manger (des lunchbox
            individuelles, par exemple). Le{" "}
            <strong className="text-ink">batch cooking</strong> prépare plutôt des{" "}
            <em>bases</em> — féculents cuits, légumes rôtis, sauces, protéines —
            que vous combinez différemment selon les jours. Le batch cooking offre
            plus de variété&nbsp;; le meal prep, plus de rapidité au moment de
            manger. Rien n&rsquo;empêche de mélanger les deux.
          </p>
        </section>

        <section id="materiel">
          <H2>Le matériel utile (rien d&rsquo;indispensable)</H2>
          <p>Pas besoin d&rsquo;équipement coûteux pour commencer&nbsp;:</p>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Des boîtes hermétiques</strong>,
              idéalement en verre (passent au four et au micro-ondes, ne gardent
              pas les odeurs).
            </Li>
            <Li>
              <strong className="text-ink">Des contenants pour congélateur</strong>{" "}
              et quelques sacs de congélation.
            </Li>
            <Li>
              <strong className="text-ink">De quoi étiqueter</strong> (masking tape
              + feutre)&nbsp;: nom du plat + date. C&rsquo;est le petit geste qui
              évite le mystère au fond du frigo.
            </Li>
            <Li>
              <strong className="text-ink">Une grande plaque de four</strong> et
              deux ou trois casseroles pour faire tourner plusieurs cuissons en
              même temps.
            </Li>
          </ul>
        </section>

        <section id="methode">
          <H2>La méthode en 6 étapes</H2>

          <Step n={1} title="Choisir des recettes qui se combinent">
            Visez 3 à 5 plats qui{" "}
            <strong className="text-ink">partagent des ingrédients</strong> et des{" "}
            <strong className="text-ink">modes de cuisson</strong>. Si trois
            recettes utilisent des oignons, on les émince tous d&rsquo;un coup. Si
            deux plats passent au four à la même température, ils cuisent ensemble.
            Pensez aussi à la conservation&nbsp;: mijotés et soupes se gardent et se
            congèlent très bien&nbsp;; les salades et fritures beaucoup moins.
          </Step>

          <Step n={2} title="Planifier l'ordre des opérations">
            C&rsquo;est le cœur du batch cooking. La règle d&rsquo;or&nbsp;:{" "}
            <strong className="text-ink">
              lancez d&rsquo;abord les cuissons les plus longues
            </strong>{" "}
            (le plat qui mijote 1&nbsp;h, le rôti au four), puis occupez les temps
            morts avec la mise en place (éplucher, tailler) et les cuissons courtes.
            On regroupe tout ce qui est «&nbsp;actif&nbsp;» (votre présence
            requise) et on laisse tourner tout ce qui est «&nbsp;passif&nbsp;»
            (le four, la casserole qui réduit).
          </Step>

          <Step n={3} title="Faire une seule liste de courses">
            Additionnez les ingrédients de toutes les recettes en{" "}
            <strong className="text-ink">fusionnant les doublons</strong> et en
            rangeant par rayon. Une seule sortie, rien d&rsquo;oublié, rien en
            double.
          </Step>

          <Step n={4} title="La session de cuisine">
            Sortez tous les ingrédients, suivez votre ordre. Démarrez les cuissons
            longues, puis enchaînez la mise en place pendant que ça cuit.
            Travailler «&nbsp;par tâche&nbsp;» (tous les épluchages, puis toutes
            les découpes) est plus rapide que recette par recette.
          </Step>

          <Step n={5} title="Refroidir puis conditionner">
            Laissez refroidir rapidement (moins de 2&nbsp;h à température ambiante),
            répartissez dans les boîtes, puis{" "}
            <strong className="text-ink">étiquetez avec la date</strong>. Ce qui
            sera mangé sous 3-4 jours va au frigo&nbsp;; le reste au congélateur.
          </Step>

          <Step n={6} title="Réchauffer et assembler en semaine">
            Le soir, il ne reste qu&rsquo;à réchauffer et, éventuellement, ajouter
            une touche fraîche (herbes, crudités, un filet d&rsquo;huile) pour que
            le plat semble préparé du jour. Sortez les portions congelées du
            lendemain la veille au frigo.
          </Step>
        </section>

        <section id="conservation">
          <H2>Conservation &amp; sécurité alimentaire</H2>
          <p>
            Quelques repères simples pour cuisiner à l&rsquo;avance sans risque&nbsp;:
          </p>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Refroidir vite&nbsp;:</strong> ne
              laissez pas un plat cuit plus de 2&nbsp;h à température ambiante avant
              de le mettre au frais.
            </Li>
            <Li>
              <strong className="text-ink">Frigo&nbsp;:</strong> 3 à 4 jours pour
              la plupart des plats cuisinés, dans une boîte fermée.
            </Li>
            <Li>
              <strong className="text-ink">Congélateur&nbsp;:</strong> 1 à 3 mois
              selon les plats. Décongelez au réfrigérateur, pas sur le plan de
              travail.
            </Li>
            <Li>
              <strong className="text-ink">On ne recongèle pas</strong> un plat
              déjà décongelé.
            </Li>
          </ul>
        </section>

        <section id="erreurs">
          <H2>Les erreurs de débutant à éviter</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Trop en faire la première fois.</strong>{" "}
              Commencez par 2-3 plats. Vous monterez en puissance ensuite.
            </Li>
            <Li>
              <strong className="text-ink">
                Choisir des recettes qui se conservent mal.
              </strong>{" "}
              Évitez pour le batch les fritures, les salades déjà assaisonnées, les
              pâtes trop cuites.
            </Li>
            <Li>
              <strong className="text-ink">Oublier d&rsquo;étiqueter.</strong> Sans
              date, on ne sait plus, donc on jette&nbsp;: tout l&rsquo;intérêt
              disparaît.
            </Li>
            <Li>
              <strong className="text-ink">Manger la même chose 4 jours.</strong>{" "}
              Préparez des bases combinables plutôt qu&rsquo;un seul grand plat
              répété.
            </Li>
          </ul>
        </section>

        <section id="menu">
          <H2>Un menu d&rsquo;exemple pour une session</H2>
          <p>
            Une session type de ~2&nbsp;h 30, pensée pour mutualiser les
            cuissons&nbsp;:
          </p>
          <Card className="p-5">
            <ul className="space-y-2 text-ink">
              <li>
                🍲 <strong>Un mijoté</strong> (chili, curry ou blanquette) — la
                cuisson longue qu&rsquo;on lance en premier.
              </li>
              <li>
                🔥 <strong>Un plateau de légumes rôtis</strong> au four — cuit
                pendant que le mijoté réduit.
              </li>
              <li>
                🍚 <strong>Une grande quantité de féculent</strong> (riz,
                semoule, pâtes) — base neutre pour plusieurs repas.
              </li>
              <li>
                🥣 <strong>Une soupe</strong> — se congèle parfaitement, idéale en
                dîner rapide.
              </li>
            </ul>
            <p className="mt-3 text-sm text-ink-soft">
              À partir de ces bases&nbsp;: bowl féculent + légumes + protéine
              lundi, mijoté mardi, soupe + tartine mercredi… La variété vient de
              l&rsquo;assemblage, pas du nombre de recettes.
            </p>
          </Card>
          <p className="mt-4">
            Envie d&rsquo;un plan tout prêt&nbsp;?{" "}
            <Link
              href="/guide/menu-batch-cooking-semaine"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              Voir notre menu batch cooking d&rsquo;une semaine
            </Link>{" "}
            — 7 dîners et la liste de courses par rayon, à imprimer.
          </p>
        </section>

        {/* CTA produit — intégré naturellement */}
        <section>
          <Card className="border-gold/40 bg-gold-soft/30 p-6 text-center">
            <h2 className="font-display text-2xl text-ink">
              Le batch cooking, sans la partie compliquée
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              {APP_NAME} construit le plan pour vous&nbsp;: il regroupe la mise en
              place, ordonne les cuissons (les plus longues d&rsquo;abord), fusionne
              la liste de courses, puis vous guide pas à pas avec des minuteurs le
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
                href="/tarifs"
                className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-parchment-deep"
              >
                Voir les offres
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
