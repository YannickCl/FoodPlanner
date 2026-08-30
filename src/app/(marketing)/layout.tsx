import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { publicRobots } from "@/lib/seo";

// La vitrine est la seule partie indexable : ce `robots` prend le pas sur le
// noindex global défini dans le layout racine, mais reste noindex tant que
// NEXT_PUBLIC_SEO_INDEX n'est pas "true".
export const metadata: Metadata = {
  robots: publicRobots,
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="no-print mb-10 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold leading-none text-ink sm:text-4xl">
            {APP_NAME}
          </span>
          <span className="hidden text-xs uppercase tracking-widest text-ink-soft md:inline">
            · {APP_TAGLINE}
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/guide/batch-cooking"
            className="hidden px-2 py-1.5 text-ink-soft hover:text-ink sm:inline"
          >
            Guide
          </Link>
          <Link href="/tarifs" className="px-2 py-1.5 text-ink-soft hover:text-ink">
            Tarifs
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-line px-3 py-1.5 text-ink hover:bg-parchment-deep"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-3 py-1.5 font-medium text-parchment hover:opacity-90"
          >
            Créer un compte
          </Link>
        </nav>
      </header>

      {children}

      <footer className="no-print mt-20 border-t border-line pt-6 text-sm text-ink-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>© {APP_NAME} · {APP_TAGLINE}</span>
          <div className="flex gap-4">
            <Link href="/guide/batch-cooking" className="hover:text-ink">
              Guide du batch cooking
            </Link>
            <Link href="/tarifs" className="hover:text-ink">
              Tarifs
            </Link>
            <Link href="/mentions-legales" className="hover:text-ink">
              Mentions légales
            </Link>
            <Link href="/login" className="hover:text-ink">
              Connexion
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
