import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Planning des repas de la famille & liste de courses",
  description:
    "Organisez les repas de la semaine, générez la liste de courses automatiquement et lancez-vous dans le batch cooking. En finir avec le « on mange quoi ce soir ? ».",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: `${APP_NAME} — le planning des repas de la famille`,
    description:
      "Organisez les repas de la semaine, la liste de courses et le batch cooking, sans prise de tête.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: APP_NAME,
      url: SITE_URL,
    },
    {
      "@type": "SoftwareApplication",
      name: APP_NAME,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web, iOS, Android (PWA)",
      url: SITE_URL,
      description:
        "Application de planning des repas de la famille : menus de la semaine, liste de courses automatique, mode cuisine et batch cooking guidé.",
      offers: [
        { "@type": "Offer", name: "Gratuit", price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Premium mensuel", price: "5.99", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Premium annuel", price: "60.00", priceCurrency: "EUR" },
      ],
    },
  ],
};

const FEATURES = [
  {
    emoji: "🗓️",
    accent: "text-green",
    title: "Un planning en deux clics",
    text: "Organise les déjeuners et dîners de la semaine — ou des mois à l’avance. L’app remplit les trous toute seule en respectant vos goûts, allergies et interdits.",
    href: "/planning-repas",
  },
  {
    emoji: "📖",
    accent: "text-gold",
    title: "Vos recettes, pas un catalogue imposé",
    text: "Dis-nous les plats que ta famille aime : l’app en crée les recettes, que tu valides. Ton carnet, à ton image.",
    href: undefined,
  },
  {
    emoji: "🛒",
    accent: "text-brick",
    title: "La liste de courses, automatique",
    text: "Générée depuis tes repas, rangée par rayon, doublons fusionnés. Tu ajoutes tes articles du quotidien, et hop, prêt pour le magasin.",
    href: "/liste-de-courses",
  },
  {
    emoji: "🍱",
    accent: "text-blue",
    title: "Le batch cooking, enfin simple",
    text: "Prépare plusieurs repas d’un coup : mise en place groupée et cuisine guidée pas à pas, avec minuteurs — même quand on débute.",
    href: "/batch-cooking",
  },
];

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/calendrier");

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-b from-gold-soft/50 to-parchment-card px-6 py-14 text-center shadow-[0_2px_24px_rgba(30,43,35,0.06)] sm:px-10 sm:py-20">
        <p className="eyebrow mb-3">Les repas de la famille, sans prise de tête</p>
        <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
          La fin du « on mange quoi ce soir ? »
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          Organise les repas que ta famille aime déjà — de la planification aux
          fourneaux. Décide une fois, mange bien toute la semaine.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-ink px-7 py-3 text-base font-semibold text-parchment shadow-sm transition-opacity hover:opacity-90"
          >
            Créer mon compte — gratuit
          </Link>
          <Link
            href="/tarifs"
            className="rounded-full border border-line px-6 py-3 text-base font-medium text-ink hover:bg-parchment-deep"
          >
            Voir les offres
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          Sans engagement · Gratuit jusqu’à 30 recettes
        </p>
      </section>

      {/* Fonctionnalités */}
      <section className="mt-16">
        <h2 className="mb-1 text-center font-display text-3xl text-ink">
          Tout au même endroit
        </h2>
        <p className="mb-8 text-center text-sm text-ink-soft">
          De l’idée de repas jusqu’à l’assiette.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => {
            const inner = (
              <Card className="h-full p-6">
                <div className={`mb-2 text-3xl ${f.accent}`}>{f.emoji}</div>
                <h3 className="mb-1 font-display text-xl text-ink">{f.title}</h3>
                <p className="text-sm text-ink-soft">{f.text}</p>
                {f.href && (
                  <p className="mt-3 text-sm font-medium text-ink">En savoir plus →</p>
                )}
              </Card>
            );
            return f.href ? (
              <Link key={f.title} href={f.href} className="block transition-transform hover:-translate-y-0.5">
                {inner}
              </Link>
            ) : (
              <div key={f.title}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* Confiance */}
      <section className="mt-16 rounded-3xl border border-line bg-parchment-card px-6 py-10 text-center sm:px-10">
        <h2 className="mx-auto max-w-2xl font-display text-2xl text-ink sm:text-3xl">
          Une app honnête, pensée pour les familles
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">
          Pas de publicité, pas de revente de tes données à des supermarchés. Un
          abonnement clair, et c’est tout. Tes recettes et ton organisation restent
          les tiennes.
        </p>
      </section>

      {/* Tarifs teaser */}
      <section className="mt-16 text-center">
        <h2 className="mb-2 font-display text-3xl text-ink">Simple et accessible</h2>
        <p className="mb-6 text-sm text-ink-soft">
          Gratuit pour commencer. Premium à partir de{" "}
          <span className="num font-semibold text-ink">5 €/mois</span> (annuel).
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-gold px-7 py-3 text-base font-semibold text-ink shadow-sm transition-opacity hover:opacity-90"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/tarifs"
            className="rounded-full border border-line px-6 py-3 text-base font-medium text-ink hover:bg-parchment-deep"
          >
            Comparer les offres
          </Link>
        </div>
      </section>
    </div>
  );
}
