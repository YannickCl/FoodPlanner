import type { Metadata } from "next";
import Image from "next/image";
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
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-mark.png"
            alt=""
            width={96}
            height={96}
            priority
            className="h-9 w-9 shrink-0 sm:h-12 sm:w-12"
          />
          <span className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold leading-none text-ink sm:text-4xl">
              {APP_NAME}
            </span>
            <span className="hidden text-xs uppercase tracking-widest text-ink-soft md:inline">
              · {APP_TAGLINE}
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            href="/guide"
            className="hidden px-2 py-1.5 text-ink-soft hover:text-ink sm:inline"
          >
            Guides
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
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/guide" className="hover:text-ink">
              Guides
            </Link>
            <Link href="/tarifs" className="hover:text-ink">
              Tarifs
            </Link>
            <Link href="/mentions-legales" className="hover:text-ink">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-ink">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-ink">
              CGU
            </Link>
            <Link href="/login" className="hover:text-ink">
              Connexion
            </Link>
            <a
              href="https://www.pinterest.com/chillmeals/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez Chill Meals sur Pinterest"
              title="Chill Meals sur Pinterest"
              className="inline-flex items-center gap-2 rounded-full bg-[#e60023] px-3 py-1.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12C24 5.372 18.627 0 12 0z" />
              </svg>
              Pinterest
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
