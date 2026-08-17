import Link from "next/link";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

// Briques partagées par les pages /guide/* (piliers et satellites).

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-3 font-display text-2xl text-ink sm:text-3xl">
      {children}
    </h2>
  );
}

export function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-5 before:absolute before:left-0 before:text-gold before:content-['•']">
      {children}
    </li>
  );
}

export function Step({
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
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Breadcrumb({ label }: { label: string }) {
  return (
    <nav className="no-print mb-4 text-sm text-ink-soft">
      <Link href="/" className="hover:text-ink">
        Accueil
      </Link>{" "}
      <span aria-hidden>›</span>{" "}
      <Link href="/guide/menu-de-la-semaine" className="hover:text-ink">
        Guide
      </Link>{" "}
      <span aria-hidden>›</span> <span className="text-ink">{label}</span>
    </nav>
  );
}

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <Card className="mb-10 p-5">
      <h2 className="mb-3 font-display text-lg text-ink">Au sommaire</h2>
      <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
        {items.map((t, i) => (
          <li key={t.id}>
            <a href={`#${t.id}`} className="text-ink-soft hover:text-ink">
              <span className="num mr-1 text-gold">{i + 1}.</span>
              {t.label}
            </a>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f) => (
        <details
          key={f.q}
          className="rounded-xl border border-line bg-parchment-card p-4"
        >
          <summary className="cursor-pointer font-medium text-ink">{f.q}</summary>
          <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function GuideCta({
  title,
  text,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  text: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <Card className="border-gold/40 bg-gold-soft/30 p-6 text-center">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">{text}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/signup"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-parchment transition-opacity hover:opacity-90"
        >
          Essayer gratuitement
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-parchment-deep"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </Card>
  );
}

/** Bloc JSON-LD Article (+ FAQPage optionnel) pour un guide. */
export function GuideJsonLd({
  title,
  description,
  path,
  published,
  faq,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
  faq?: { q: string; a: string }[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: title,
      description,
      inLanguage: "fr-FR",
      datePublished: published,
      dateModified: published,
      author: { "@type": "Organization", name: APP_NAME },
      publisher: { "@type": "Organization", name: APP_NAME },
      mainEntityOfPage: `${SITE_URL}${path}`,
    },
  ];
  if (faq && faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
