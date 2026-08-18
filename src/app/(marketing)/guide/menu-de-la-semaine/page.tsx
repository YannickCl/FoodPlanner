import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Menu de la semaine : la méthode simple pour s'organiser";
const DESCRIPTION =
  "Comment établir un menu de la semaine pour la famille sans y penser tous les jours : une méthode en 5 étapes, une trame prête à l'emploi, des repères pour un menu équilibré et à petit budget.";
const PUBLISHED = "2026-08-17";
const URL_PATH = "/guide/menu-de-la-semaine";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_PATH },
  openGraph: { type: "article", url: URL_PATH, title: TITLE, description: DESCRIPTION },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Combien de temps faut-il pour planifier son menu de la semaine ?",
    a: "Une fois la méthode en place, 15 à 20 minutes par semaine suffisent : on choisit les plats, on vérifie l'agenda et on en déduit la liste de courses. C'est ce quart d'heure qui vous évite la question « on mange quoi ? » tous les soirs.",
  },
  {
    q: "Comment éviter de manger toujours la même chose ?",
    a: "Constituez une « banque » d'une vingtaine de plats que votre famille aime, classés par type (rapide, végé, mijoté…), et faites-les tourner. Une trame par jour (voir plus bas) apporte de la variété sans effort de décision.",
  },
  {
    q: "Comment faire un menu de la semaine équilibré ?",
    a: "Visez l'équilibre sur la semaine, pas à chaque repas : environ la moitié de l'assiette en légumes, un quart en féculents, un quart en protéines. Variez les sources de protéines et prévoyez du poisson une à deux fois par semaine.",
  },
  {
    q: "Comment réduire le budget avec un menu de la semaine ?",
    a: "Planifier fait déjà baisser la facture : on achète selon une liste précise, moins d'achats impulsifs et moins de gaspillage. Ajoutez des repas végétariens, cuisinez de plus grandes quantités et privilégiez les produits de saison.",
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
  { id: "pourquoi", label: "Pourquoi planifier son menu" },
  { id: "methode", label: "La méthode en 5 étapes" },
  { id: "trame", label: "Une trame prête à l'emploi" },
  { id: "varier", label: "Varier sans se casser la tête" },
  { id: "equilibre", label: "Un menu équilibré" },
  { id: "budget", label: "Menu de la semaine & budget" },
  { id: "faq", label: "Questions fréquentes" },
];

// Trame hebdo type (un fil conducteur par jour).
const TRAME: { jour: string; theme: string; exemple: string }[] = [
  { jour: "Lundi", theme: "Rapide", exemple: "Pâtes, sauce express et légumes" },
  { jour: "Mardi", theme: "Poisson", exemple: "Filet de poisson + légumes rôtis" },
  { jour: "Mercredi", theme: "Végétarien", exemple: "Curry de légumes, gratin, dahl" },
  { jour: "Jeudi", theme: "Vide-frigo", exemple: "On recycle les restes de la semaine" },
  { jour: "Vendredi", theme: "Plaisir", exemple: "Pizza maison, burgers, tacos" },
  { jour: "Samedi", theme: "Mijoté", exemple: "Un plat qu'on prend le temps de faire" },
  { jour: "Dimanche", theme: "Familial", exemple: "Rôti, blanquette, grand plat partagé" },
];

export default function GuideMenuSemainePage() {
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
        <span className="text-ink">Menu de la semaine</span>
      </nav>

      <header className="mb-8">
        <p className="eyebrow mb-2">Guide complet</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Menu de la semaine : la méthode simple pour s&rsquo;organiser
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Décider une fois, bien manger toute la semaine. Voici une méthode
          concrète pour établir le menu de la famille en quinze minutes — et ne
          plus jamais subir le « on mange quoi ce soir&nbsp;? ».
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
        <section id="pourquoi">
          <H2>Pourquoi planifier son menu de la semaine</H2>
          <p className="mb-3">
            Planifier ses repas n&rsquo;est pas une contrainte de plus&nbsp;:
            c&rsquo;est justement ce qui allège le quotidien. Les bénéfices sont
            concrets&nbsp;:
          </p>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Moins de{" "}
              <Link
                href="/guide/charge-mentale-repas"
                className="underline decoration-gold underline-offset-2 hover:text-gold"
              >
                charge mentale
              </Link>
              .</strong>{" "}
              La décision est prise une fois pour la semaine, pas réinventée
              chaque soir à 19&nbsp;h.
            </Li>
            <Li>
              <strong className="text-ink">Des courses efficaces.</strong> Une
              seule liste, construite à partir des repas prévus&nbsp;: moins
              d&rsquo;oublis, moins d&rsquo;allers-retours.
            </Li>
            <Li>
              <strong className="text-ink">Des économies.</strong> On achète ce
              qui sera vraiment cuisiné&nbsp;: moins d&rsquo;achats impulsifs et
              beaucoup moins de gaspillage.
            </Li>
            <Li>
              <strong className="text-ink">Une meilleure alimentation.</strong>{" "}
              Sur une semaine pensée à l&rsquo;avance, on équilibre plus
              facilement et on cède moins au dépannage industriel.
            </Li>
          </ul>
        </section>

        <section id="methode">
          <H2>La méthode en 5 étapes</H2>

          <Step n={1} title="Regardez l'agenda avant les recettes">
            Combien de soirs serez-vous vraiment à table&nbsp;? Un soir de
            réunion tardive appelle un plat express ou un reste&nbsp;; un
            dimanche tranquille, un plat qui mijote. On adapte le menu à la
            semaine réelle, pas l&rsquo;inverse.
          </Step>

          <Step n={2} title="Faites l'inventaire du frigo et des placards">
            Partez de ce que vous avez déjà (surtout ce qui doit être consommé
            vite). C&rsquo;est le meilleur point de départ contre le gaspillage.
          </Step>

          <Step n={3} title="Piochez dans votre répertoire de plats">
            Inutile de tout réinventer&nbsp;: gardez une liste d&rsquo;une
            vingtaine de plats que la famille aime, et choisissez-y. Vous
            gagnerez un temps fou en évitant la page blanche.
          </Step>

          <Step n={4} title="Équilibrez sur la semaine">
            Alternez les sources de protéines (viande, poisson, œufs,
            légumineuses), glissez un ou deux repas végétariens, et pensez
            saison. L&rsquo;équilibre se joue sur les sept jours, pas à chaque
            assiette.
          </Step>

          <Step n={5} title="Déduisez-en la liste de courses">
            Une fois les repas posés, la liste de courses en découle
            directement. C&rsquo;est là qu&rsquo;une app fait gagner le plus de
            temps&nbsp;: elle agrège les ingrédients, fusionne les doublons et
            range par rayon.
          </Step>

          <p className="mt-4">
            C&rsquo;est exactement ce que fait{" "}
            <Link
              href="/planning-repas"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              le planning de repas de {APP_NAME}
            </Link>{" "}
            : vous remplissez le calendrier (ou vous le générez), la liste de
            courses suit toute seule.
          </p>
        </section>

        <section id="trame">
          <H2>Une trame prête à l&rsquo;emploi</H2>
          <p className="mb-4">
            Le secret des familles organisées&nbsp;: un{" "}
            <strong className="text-ink">fil conducteur par jour</strong>. On ne
            choisit plus «&nbsp;quoi&nbsp;» mais seulement «&nbsp;lequel&nbsp;»
            dans une catégorie — bien plus rapide. Un exemple&nbsp;:
          </p>
          <Card className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-ink-soft">
                    <th className="py-2 pr-3 font-semibold">Jour</th>
                    <th className="py-2 pr-3 font-semibold">Thème</th>
                    <th className="py-2 font-semibold">Exemple</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAME.map((t) => (
                    <tr key={t.jour} className="border-b border-line/60">
                      <td className="py-2 pr-3 font-medium text-ink">{t.jour}</td>
                      <td className="py-2 pr-3 text-ink">{t.theme}</td>
                      <td className="py-2 text-ink-soft">{t.exemple}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="mt-3 text-sm">
            Adaptez les thèmes à vos habitudes. L&rsquo;idée n&rsquo;est pas de
            s&rsquo;enfermer, mais de réduire le nombre de décisions. Envie de le
            faire sur papier&nbsp;? Imprimez notre{" "}
            <Link
              href="/guide/semainier-a-imprimer"
              className="underline decoration-gold underline-offset-2 hover:text-gold"
            >
              semainier vierge
            </Link>
            .
          </p>
        </section>

        <section id="varier">
          <H2>Varier sans se casser la tête</H2>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">Une banque de repas.</strong> Notez
              vos plats favoris une bonne fois&nbsp;; piochez dedans chaque
              semaine plutôt que de chercher l&rsquo;inspiration à zéro. Besoin
              d&rsquo;inspiration&nbsp;? Voyez nos{" "}
              <Link
                href="/guide/idees-repas-semaine"
                className="underline decoration-gold underline-offset-2 hover:text-gold"
              >
                idées de repas pour la semaine
              </Link>
              .
            </Li>
            <Li>
              <strong className="text-ink">La rotation.</strong> Évitez de
              reproposer un plat trop récent&nbsp;: une simple règle
              d&rsquo;espacement suffit à garder de la variété.
            </Li>
            <Li>
              <strong className="text-ink">La saison.</strong> Cuisiner de
              saison renouvelle naturellement les menus au fil de l&rsquo;année,
              tout en coûtant moins cher.
            </Li>
          </ul>
        </section>

        <section id="equilibre">
          <H2>Un menu de la semaine équilibré</H2>
          <p className="mb-3">Quelques repères simples, sans se compliquer&nbsp;:</p>
          <ul className="ml-1 space-y-2">
            <Li>
              <strong className="text-ink">L&rsquo;assiette&nbsp;:</strong>{" "}
              environ ½ de légumes, ¼ de féculents, ¼ de protéines.
            </Li>
            <Li>
              <strong className="text-ink">Le poisson&nbsp;:</strong> une à deux
              fois par semaine, dont un poisson gras.
            </Li>
            <Li>
              <strong className="text-ink">Le végétarien&nbsp;:</strong> un ou
              deux repas sans viande (légumineuses, œufs) — bon pour la santé et
              le budget.
            </Li>
            <Li>
              <strong className="text-ink">La souplesse&nbsp;:</strong>{" "}
              l&rsquo;équilibre se juge sur la semaine entière, pas repas par
              repas.
            </Li>
          </ul>
          <p className="mt-4">
            Pour un exemple concret, voyez notre{" "}
            <Link
              href="/guide/menu-equilibre-semaine"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              menu de la semaine équilibré
            </Link>
            .
          </p>
        </section>

        <section id="budget">
          <H2>Menu de la semaine &amp; budget</H2>
          <p className="mb-3">
            Un menu planifié est déjà un menu plus économique. Pour aller plus
            loin&nbsp;:
          </p>
          <ul className="ml-1 space-y-2">
            <Li>Achetez selon la liste — et tenez-vous-y en magasin.</Li>
            <Li>Cuisinez de plus grandes quantités et réutilisez les bases.</Li>
            <Li>Multipliez les repas végétariens et les produits de saison.</Li>
          </ul>
          <p className="mt-4">
            Notre{" "}
            <Link
              href="/guide/menu-semaine-pas-cher"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              menu de la semaine pas cher
            </Link>{" "}
            détaille un exemple à petit budget.
          </p>
          <p className="mt-4">
            Le prolongement naturel, c&rsquo;est le{" "}
            <Link
              href="/guide/batch-cooking"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              batch cooking
            </Link>{" "}
            : préparer plusieurs repas en une session. Pour un plan tout prêt,
            voyez notre{" "}
            <Link
              href="/guide/menu-batch-cooking-semaine"
              className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold"
            >
              menu batch d&rsquo;une semaine
            </Link>
            .
          </p>
        </section>

        <section>
          <Card className="border-gold/40 bg-gold-soft/30 p-6 text-center">
            <h2 className="font-display text-2xl text-ink">
              Votre menu de la semaine, en quinze minutes
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              {APP_NAME} construit le menu à partir de vos plats favoris, génère
              la liste de courses et vous guide en cuisine. Gratuit pour
              commencer.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-parchment transition-opacity hover:opacity-90"
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/planning-repas"
                className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-parchment-deep"
              >
                Découvrir le planning
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
