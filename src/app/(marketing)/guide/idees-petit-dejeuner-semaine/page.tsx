import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb, Faq, GuideCta, GuideJsonLd, H2 } from "../../_components/guide-ui";

const TITLE = "Idées de petits-déjeuners de la semaine (rapides, à préparer la veille, pour les enfants)";
const DESCRIPTION =
  "Un petit-déjeuner différent chaque jour : 7 idées pour la semaine + des listes par envie (express, à préparer la veille, salés, gourmands du week-end, pour les enfants). De quoi ne plus jamais sécher le matin.";
const PUBLISHED = "2026-09-01";
const PATH = "/guide/idees-petit-dejeuner-semaine";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
};

const SEMAINE: { jour: string; idee: string }[] = [
  { jour: "Lundi", idee: "Porridge flocons d'avoine, banane & cannelle" },
  { jour: "Mardi", idee: "Tartines pain complet, beurre & confiture + fruit" },
  { jour: "Mercredi", idee: "Yaourt, granola maison & fruits rouges" },
  { jour: "Jeudi", idee: "Œufs brouillés & pain grillé" },
  { jour: "Vendredi", idee: "Smoothie bowl (fruits, flocons, graines)" },
  { jour: "Samedi", idee: "Pancakes maison & sirop d'érable" },
  { jour: "Dimanche", idee: "Brunch : œufs à la coque, avocado toast & jus" },
];

const CATEGORIES: { emoji: string; titre: string; idees: string[] }[] = [
  {
    emoji: "⚡",
    titre: "Express en semaine (5 min)",
    idees: ["Yaourt + granola + fruit", "Tartines beurre de cacahuète & banane", "Porridge express au micro-ondes", "Smoothie à emporter"],
  },
  {
    emoji: "🌙",
    titre: "À préparer la veille",
    idees: ["Overnight oats (flocons trempés)", "Chia pudding au lait végétal", "Muffins maison", "Pancakes à réchauffer"],
  },
  {
    emoji: "💪",
    titre: "Salés & protéinés",
    idees: ["Œufs (brouillés, durs, omelette)", "Avocado toast", "Fromage blanc, noix & miel", "Tartine houmous & crudités"],
  },
  {
    emoji: "🥐",
    titre: "Gourmands (week-end)",
    idees: ["Pancakes ou gaufres maison", "Pain perdu", "Œufs au plat & pain grillé", "Viennoiseries & fruits"],
  },
  {
    emoji: "🧒",
    titre: "Pour les enfants",
    idees: ["Porridge cacao", "Tartines banane-miel", "Mini-pancakes", "Yaourt à boire maison & compote"],
  },
];

const FAQ = [
  {
    q: "Que prendre au petit-déjeuner en semaine quand on est pressé ?",
    a: "Misez sur des formats prêts en 5 minutes : un yaourt avec du granola et un fruit, des tartines de pain complet, un porridge express au micro-ondes, ou un smoothie à emporter. Le plus efficace reste de préparer la veille (overnight oats, chia pudding) pour n'avoir qu'à sortir le bol le matin.",
  },
  {
    q: "Comment préparer le petit-déjeuner la veille ?",
    a: "Les overnight oats sont la solution reine : flocons d'avoine + lait (ou boisson végétale) + fruits, laissés une nuit au frais. Le chia pudding, les muffins maison et une fournée de pancakes à réchauffer se préparent aussi à l'avance et se gardent 2-3 jours au réfrigérateur.",
  },
  {
    q: "Quel petit-déjeuner équilibré composer ?",
    a: "Un bon équilibre associe une source de glucides complexes (flocons, pain complet), une protéine (œuf, yaourt, fromage blanc), un fruit et un peu de bon gras (oléagineux, graines). Cette combinaison rassasie jusqu'au déjeuner sans coup de barre.",
  },
  {
    q: "Des idées de petit-déjeuner pour les enfants qui aiment varier ?",
    a: "Alternez sucré et un peu de salé : porridge au cacao, tartines banane-miel, mini-pancakes, yaourt à boire maison avec une compote, ou un œuf à la coque avec des mouillettes le week-end. Impliquer les enfants dans la préparation aide beaucoup.",
  },
];

export default function PetitDejeunerSemainePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <GuideJsonLd title={TITLE} description={DESCRIPTION} path={PATH} published={PUBLISHED} faq={FAQ} />
      <Breadcrumb label="Petits-déjeuners de la semaine" />

      <header className="mb-8">
        <p className="eyebrow mb-2">Idées repas</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Petits-déjeuners de la semaine
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Un petit-déjeuner différent chaque jour, sans se compliquer&nbsp;: voici{" "}
          <strong className="text-ink">7 idées pour la semaine</strong>, puis des listes
          par envie — express, à préparer la veille, salés, gourmands du week-end et
          pour les enfants.
        </p>
      </header>

      <Card className="mb-8 p-5">
        <h2 className="mb-4 font-display text-2xl text-ink">Une semaine de petits-déjeuners</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {SEMAINE.map((s) => (
                <tr key={s.jour} className="border-b border-line/60 last:border-0">
                  <td className="w-28 py-2 pr-3 font-medium text-ink">{s.jour}</td>
                  <td className="py-2 text-ink">{s.idee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-4">
        {CATEGORIES.map((c) => (
          <Card key={c.titre} className="p-5">
            <h2 className="mb-3 font-display text-xl text-ink">
              <span className="mr-2" aria-hidden>{c.emoji}</span>
              {c.titre}
            </h2>
            <ul className="grid gap-x-6 gap-y-1.5 text-sm text-ink sm:grid-cols-2">
              {c.idees.map((idea) => (
                <li key={idea} className="relative pl-4 before:absolute before:left-0 before:text-gold before:content-['–']">
                  {idea}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-10 space-y-10 text-ink-soft">
        <section>
          <H2>L&rsquo;astuce&nbsp;: anticiper le matin</H2>
          <p>
            Le secret d&rsquo;un petit-déjeuner sans stress, c&rsquo;est de{" "}
            <strong className="text-ink">décider et préparer à l&rsquo;avance</strong>. En
            plaçant les petits-déjeuners dans votre{" "}
            <Link href="/guide/menu-de-la-semaine" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              menu de la semaine
            </Link>
            , vous achetez le bon (flocons, yaourts, fruits, œufs) et vous préparez la
            veille ce qui peut l&rsquo;être — dans l&rsquo;esprit{" "}
            <Link href="/guide/meal-prep-debutant" className="font-medium text-ink underline decoration-gold underline-offset-2 hover:text-gold">
              meal prep
            </Link>
            . Le matin, il ne reste plus qu&rsquo;à servir.
          </p>
        </section>

        <GuideCta
          title="Toute la semaine, petit-déj compris"
          text="Chill Meals planifie tous les repas de la famille — petits-déjeuners inclus — en respectant vos goûts, et génère la liste de courses. Fini le rayon vide un mardi matin."
          secondaryHref="/guide/idees-repas-semaine"
          secondaryLabel="Des idées pour tous les repas"
        />

        <section>
          <H2>Questions fréquentes</H2>
          <Faq items={FAQ} />
        </section>
      </div>
    </article>
  );
}
