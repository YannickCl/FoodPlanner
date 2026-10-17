import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: APP_NAME,
  description:
    "Planification des repas de la famille : assistant IA de recettes, planning automatique de la semaine, liste de courses et batch cooking guidé. Gratuit pendant le lancement.",
  brand: { "@type": "Brand", name: APP_NAME },
  offers: {
    "@type": "Offer",
    name: "Membre fondateur — accès complet gratuit",
    price: "0",
    priceCurrency: "EUR",
    url: `${SITE_URL}/tarifs`,
    availability: "https://schema.org/InStock",
  },
};

export const metadata: Metadata = {
  title: "Gratuit pour les membres fondateurs",
  description:
    "Chill Meals est gratuit pendant le lancement : les premiers inscrits deviennent membres fondateurs et gardent l'accès complet (IA, planning, batch cooking) gratuit à vie.",
  alternates: { canonical: "/tarifs" },
  openGraph: {
    url: "/tarifs",
    title: "Gratuit pour les membres fondateurs",
    description:
      "Accès complet, gratuit à vie pour les premiers inscrits. Rejoignez les membres fondateurs de Chill Meals.",
  },
};

const INCLUDED = [
  "Carnet de recettes illimité",
  "Assistant IA — des recettes sur mesure à partir de vos plats",
  "Planning manuel et automatique (semaine ou mois)",
  "Liste de courses automatique, rangée par rayon",
  "Mode cuisine pas à pas + minuteurs",
  "Batch cooking + cuisine guidée",
  "Foyer partagé entre plusieurs comptes",
];

export default function TarifsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="mb-8 text-center">
        <p className="eyebrow mb-1">Offre de lancement</p>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">
          Gratuit pour les membres fondateurs
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          {APP_NAME} est <strong className="text-ink">100&nbsp;% gratuit</strong> pendant
          le lancement. Les premiers inscrits deviennent{" "}
          <strong className="text-ink">membres fondateurs</strong> et gardent l&rsquo;accès
          complet — <strong className="text-ink">gratuit à vie</strong>.
        </p>
      </div>

      <Card className="border-2 border-gold p-6 sm:p-8">
        <div className="flex items-center justify-center">
          <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-ink">
            ⭐ Membre fondateur
          </span>
        </div>
        <p className="mt-4 text-center">
          <span className="num text-5xl font-semibold text-ink">0&nbsp;€</span>
        </p>
        <p className="mb-6 text-center text-sm text-ink-soft">
          Tout inclus, à vie pour les fondateurs.
        </p>

        <ul className="mx-auto mb-6 max-w-md space-y-2">
          {INCLUDED.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-0.5 text-green" aria-hidden>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/signup"
          className="block rounded-full bg-gold px-6 py-3 text-center text-base font-semibold text-ink shadow-sm transition-opacity hover:opacity-90"
        >
          Devenir membre fondateur — gratuit
        </Link>
        <p className="mt-3 text-center text-xs text-ink-soft">
          Sans carte bancaire. Inscription en 1 minute.
        </p>
      </Card>

      <p className="mx-auto mt-6 max-w-xl text-center text-xs text-ink-soft">
        Après la phase de lancement, {APP_NAME} passera à{" "}
        <span className="num">5,99&nbsp;€/mois</span> (ou{" "}
        <span className="num">60&nbsp;€/an</span>). Les membres fondateurs, eux, ne
        paieront jamais — c&rsquo;est notre merci aux premiers qui nous font confiance.
      </p>
    </div>
  );
}
