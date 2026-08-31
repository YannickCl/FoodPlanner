import { Card } from "@/components/ui";

export function LegalPage({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-display text-4xl text-ink">{title}</h1>
      <p className="mb-1 text-sm text-ink-soft">{subtitle}</p>
      <p className="mb-6 text-xs text-ink-soft">Dernière mise à jour : {updated}</p>
      <Card className="space-y-6 p-6 text-sm leading-relaxed text-ink">{children}</Card>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-1.5 font-display text-lg text-ink">{title}</h2>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

export function Li({ children }: { children: React.ReactNode }) {
  return <li className="ml-4 list-disc">{children}</li>;
}

/** Champ à compléter par l'éditeur avant l'ouverture au public. */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-gold-soft/60 px-1 font-medium text-ink">
      [{children}]
    </span>
  );
}
