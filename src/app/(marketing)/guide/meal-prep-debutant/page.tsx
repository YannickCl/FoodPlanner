import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2, Li, Step } from "../../_components/guide-ui";

const TITLE = "Meal prep : le guide pour débuter (méthode simple, semaine par semaine)";
const DESCRIPTION =
  "Le meal prep pour débutants : ce que c'est, la différence avec le batch cooking, et une méthode en 5 étapes pour préparer vos repas de la semaine à l'avance — même en partant de zéro. Erreurs à éviter et conservation.";
const PUBLISHED = "2026-09-01";
const PATH = "/guide/meal-prep-debutant";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const PREP: { emoji: string; titre: string; items: string[] }[] = [
  {
    emoji: "🍗",
    titre: "Les protéines",
    items: ["Poulet rôti ou grillé", "Œufs durs", "Pois chiches / lentilles cuits", "Bœuf haché revenu"],
  },
  {
    emoji: "🍚",
    titre: "Les féculents",
    items: ["Riz", "Pâtes ou semoule", "Quinoa", "Pommes de terre rôties"],
  },
  {
    emoji: "🥕",
    titre: "Les légumes",
    items: ["Légumes rôtis au four", "Crudités lavées et coupées", "Poêlée de légumes", "Soupe"],
  },
  {
    emoji: "🥫",
    titre: "Les extras",
    items: ["Sauces & vinaigrettes", "Fromage râpé", "Herbes fraîches", "Graines / oléagineux"],
  },
];

const FAQ = [
  {
    q: "Quelle est la différence entre meal prep et batch cooking ?",
    a: "Le batch cooking consiste à cuisiner plusieurs plats complets en une seule session. Le meal prep est plus souple : on prépare des composants (protéines, féculents, légumes, sauces) qu'on assemble ensuite au fil de la semaine. Le meal prep demande moins de décisions à l'avance et laisse plus de liberté au moment du repas.",
  },
  {
    q: "Combien de temps se conservent les préparations ?",
    a: "En général 3 à 4 jours au réfrigérateur dans des boîtes hermétiques. Au-delà, congelez : la plupart des plats mijotés, soupes et sauces se congèlent très bien. Refroidissez toujours rapidement (moins de 2 h) avant de mettre au froid, et notez la date sur chaque boîte.",
  },
  {
    q: "Par où commencer quand on débute le meal prep ?",
    a: "Commencez petit : préparez seulement 2-3 dîners à l'avance, pas toute la semaine. Choisissez des recettes que vous maîtrisez déjà, prévoyez quelques boîtes hermétiques, et bloquez 1 h à 1 h 30 un jour de la semaine. Vous ajusterez la quantité une fois le réflexe pris.",
  },
  {
    q: "Faut-il du matériel spécial pour le meal prep ?",
    a: "Non. Il faut surtout des boîtes de conservation hermétiques (idéalement transparentes et empilables) et de quoi étiqueter les dates. Une plaque de four et deux casseroles suffisent pour préparer l'essentiel d'une semaine.",
  },
];

export default function MealPrepDebutantPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Meal prep : le guide pour débuter" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Guide pratique</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Le meal prep pour débuter
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Préparer ses repas de la semaine à l&rsquo;avance, sans y passer son
          dimanche ni devenir un pro de la cuisine. Voici ce qu&rsquo;est vraiment
          le meal prep, et une méthode <strong className="text-ink">en 5 étapes</strong> pour
          s&rsquo;y mettre en partant de zéro.
        </p>
      </header>

      <div className="space-y-10 text-ink-soft">
        <section>
          <H2>Meal prep ou batch cooking&nbsp;?</H2>
          <p>
            Les deux visent le même but — gagner du temps en semaine — mais ne
            fonctionnent pas pareil&nbsp;:
          </p>
          <ul className="ml-1 mt-3 space-y-2">
            <Li>
              <strong className="text-ink">Le batch cooking</strong> prépare des{" "}
              <em>plats complets</em> en une session. Voir notre{" "}
              <Link href="/guide/batch-cooking" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
                guide du batch cooking
              </Link>
              .
            </Li>
            <Li>
              <strong className="text-ink">Le meal prep</strong> prépare des{" "}
              <em>composants</em> (protéines, féculents, légumes, sauces) qu&rsquo;on
              assemble ensuite selon l&rsquo;envie. Plus souple, idéal pour débuter.
            </Li>
          </ul>
        </section>

        <section>
          <H2>La méthode en 5 étapes</H2>
          <Step n={1} title="Choisir son créneau">
            Bloquez <strong className="text-ink">1 h à 1 h 30</strong> un jour fixe
            (souvent le dimanche). Un rendez-vous récurrent, sinon ça ne tient pas.
          </Step>
          <Step n={2} title="Décider quoi préparer">
            Visez <strong className="text-ink">2-3 dîners</strong> pour commencer, pas
            toute la semaine. Partez d&rsquo;un{" "}
            <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              menu de la semaine
            </Link>{" "}
            pour savoir exactement quoi acheter.
          </Step>
          <Step n={3} title="Cuire les composants en parallèle">
            Lancez d&rsquo;abord ce qui cuit longtemps (four, mijoté), puis remplissez
            les temps morts avec le riz, les œufs, les légumes. Un féculent, une
            protéine, des légumes&nbsp;: la base d&rsquo;un repas équilibré.
          </Step>
          <Step n={4} title="Refroidir, ranger, étiqueter">
            Laissez refroidir moins de 2 h, répartissez en boîtes hermétiques, et{" "}
            <strong className="text-ink">notez la date</strong>. Ce qui sera mangé après
            4 jours part au congélateur.
          </Step>
          <Step n={5} title="Assembler au fil de la semaine">
            Le soir, vous <em>composez</em> l&rsquo;assiette à partir des composants&nbsp;:
            bowl, gratin express, poêlée… 10 minutes montre en main.
          </Step>
        </section>

        <section>
          <H2>Quoi préparer&nbsp;: la check-list</H2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PREP.map((p) => (
              <Card key={p.titre} className="p-5">
                <h3 className="mb-2 font-display text-lg text-ink">
                  <span className="mr-2" aria-hidden>{p.emoji}</span>
                  {p.titre}
                </h3>
                <ul className="space-y-1 text-sm text-ink">
                  {p.items.map((it) => (
                    <li key={it} className="relative pl-4 before:absolute before:left-0 before:text-gold before:content-['–']">
                      {it}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <H2>Les erreurs de débutant à éviter</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Trop en faire d&rsquo;un coup&nbsp;:</strong>{" "}
              préparer 7 jours dès la première fois, se décourager, tout arrêter.
              Commencez par 2-3 repas.
            </Li>
            <Li>
              <strong className="text-ink">Négliger la conservation&nbsp;:</strong> ranger
              un plat encore chaud ou sans date. Refroidissez vite, étiquetez toujours.
            </Li>
            <Li>
              <strong className="text-ink">Tout assaisonner à l&rsquo;avance&nbsp;:</strong>{" "}
              certains plats se détrempent. Gardez sauces et éléments croquants à part,
              à ajouter au moment de servir.
            </Li>
            <Li>
              <strong className="text-ink">Manquer de boîtes&nbsp;:</strong> prévoyez assez
              de contenants hermétiques avant de commencer.
            </Li>
          </ul>
        </section>

        <GuideCta
          title="Votre meal prep, organisé pour vous"
          text="Chill Meals part des plats que votre famille aime, compose le menu de la semaine, génère la liste de courses et vous guide pour tout préparer. Le meal prep sans la charge mentale."
          secondaryHref="/guide/batch-cooking"
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
