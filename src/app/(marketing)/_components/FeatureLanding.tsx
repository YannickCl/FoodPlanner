import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

export type FeatureLandingData = {
  eyebrow: string;
  title: string;
  intro: string;
  canonicalPath: string;
  bullets: { emoji: string; title: string; text: string }[];
  steps: { title: string; text: string }[];
  related: { href: string; label: string }[];
  faq: { q: string; a: string }[];
};

export function FeatureLanding(d: FeatureLandingData) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
    url: `${SITE_URL}${d.canonicalPath}`,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-b from-gold-soft/50 to-parchment-card px-6 py-12 text-center shadow-[0_2px_24px_rgba(30,43,35,0.06)] sm:px-10 sm:py-16">
        <p className="eyebrow mb-3">{d.eyebrow}</p>
        <h1 className="mx-auto max-w-2xl text-balance font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
          {d.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{d.intro}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
      </section>

      {/* Bénéfices */}
      <section className="mt-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {d.bullets.map((b) => (
            <Card key={b.title} className="p-6">
              <div className="mb-2 text-3xl">{b.emoji}</div>
              <h2 className="mb-1 font-display text-xl text-ink">{b.title}</h2>
              <p className="text-sm text-ink-soft">{b.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mt-14">
        <h2 className="mb-6 text-center font-display text-3xl text-ink">
          Comment ça marche
        </h2>
        <ol className="space-y-5">
          {d.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-soft text-base font-semibold text-ink">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h3 className="mb-0.5 font-display text-xl text-ink">{s.title}</h3>
                <p className="text-sm text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Pages liées (maillage interne) */}
      {d.related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl text-ink">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            {d.related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-full border border-line bg-parchment-card px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/40"
              >
                {r.label} →
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="mb-4 font-display text-2xl text-ink">Questions fréquentes</h2>
        <div className="space-y-3">
          {d.faq.map((f) => (
            <details
              key={f.q}
              className="rounded-xl border border-line bg-parchment-card p-4"
            >
              <summary className="cursor-pointer font-medium text-ink">{f.q}</summary>
              <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mt-14">
        <Card className="border-gold/40 bg-gold-soft/30 p-8 text-center">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Prêt·e à en finir avec le « on mange quoi ce soir ? »
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-soft">
            {APP_NAME} s&rsquo;occupe des repas de la famille, de la planification aux
            fourneaux. Gratuit pour commencer.
          </p>
          <div className="mt-5">
            <Link
              href="/signup"
              className="rounded-full bg-ink px-7 py-3 text-base font-semibold text-parchment transition-opacity hover:opacity-90"
            >
              Créer mon compte
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
