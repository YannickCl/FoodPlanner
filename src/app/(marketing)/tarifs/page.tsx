import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: `${APP_NAME} Premium`,
  description:
    "Assistant IA de recettes, planning automatique de la semaine et batch cooking guidé pour les repas de la famille.",
  brand: { "@type": "Brand", name: APP_NAME },
  offers: [
    {
      "@type": "Offer",
      name: "Premium mensuel",
      price: "5.99",
      priceCurrency: "EUR",
      url: `${SITE_URL}/tarifs`,
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Premium annuel",
      price: "60.00",
      priceCurrency: "EUR",
      url: `${SITE_URL}/tarifs`,
      availability: "https://schema.org/InStock",
    },
  ],
};

export const metadata: Metadata = {
  title: "Tarifs & abonnement",
  description:
    "Gratuit jusqu'à 30 recettes, ou Premium dès 5 €/mois (annuel) : assistant IA, planning automatique et batch cooking. Essai gratuit de 7 jours.",
  alternates: { canonical: "/tarifs" },
  openGraph: {
    url: "/tarifs",
    title: "Tarifs & abonnement",
    description:
      "Gratuit pour commencer, Premium dès 5 €/mois (annuel). Essai gratuit de 7 jours.",
  },
};

const ROWS: { label: string; free: string | boolean; premium: string | boolean }[] = [
  { label: "Carnet de recettes", free: "30 recettes", premium: "Illimité" },
  { label: "Planning manuel", free: true, premium: true },
  { label: "Liste de courses automatique", free: true, premium: true },
  { label: "Mode cuisine pas à pas + minuteurs", free: true, premium: true },
  { label: "Assistant IA (recettes sur mesure)", free: false, premium: true },
  { label: "Planning automatique longue durée", free: false, premium: true },
  { label: "Batch cooking + cuisine guidée", free: false, premium: true },
];

function Mark({ v }: { v: string | boolean }) {
  if (v === true) return <span className="text-green">✓</span>;
  if (v === false) return <span className="text-ink-soft/50">—</span>;
  return <span className="text-ink">{v}</span>;
}

export default function TarifsPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <div className="mb-8 text-center">
        <p className="eyebrow mb-1">Nos offres</p>
        <h1 className="font-display text-4xl text-ink">Simple et accessible</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Commence gratuitement. Passe en premium quand tu veux, sans engagement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink">Gratuit</h2>
          <p className="num mt-1 text-3xl font-semibold text-ink">0 €</p>
          <p className="mb-4 text-sm text-ink-soft">Pour bien commencer.</p>
          <Link
            href="/signup"
            className="block rounded-full border border-ink px-5 py-2.5 text-center text-sm font-medium text-ink hover:bg-ink hover:text-parchment"
          >
            Créer mon compte
          </Link>
        </Card>

        <Card className="border-2 border-gold p-6">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="font-display text-2xl text-ink">Premium</h2>
            <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold text-ink">
              Essai 7 jours
            </span>
          </div>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="num text-3xl font-semibold text-ink">5,99 €</span>
            <span className="text-sm text-ink-soft">/ mois</span>
          </p>
          <p className="mb-4 text-sm text-ink-soft">
            ou <span className="num font-medium text-ink">60 €/an</span> — 2 mois offerts.
          </p>
          <Link
            href="/signup"
            className="block rounded-full bg-gold px-5 py-2.5 text-center text-sm font-semibold text-ink shadow-sm hover:opacity-90"
          >
            Essayer le premium
          </Link>
        </Card>
      </div>

      {/* Comparatif */}
      <Card className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 font-medium text-ink-soft">Fonctionnalité</th>
                <th className="px-4 py-3 text-center font-medium text-ink-soft">Gratuit</th>
                <th className="px-4 py-3 text-center font-medium text-gold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-line/60">
                  <td className="px-4 py-3 text-ink">{r.label}</td>
                  <td className="px-4 py-3 text-center">
                    <Mark v={r.free} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Mark v={r.premium} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-ink-soft">
        Prix TTC. Sans engagement, résiliable à tout moment.
      </p>
    </div>
  );
}
