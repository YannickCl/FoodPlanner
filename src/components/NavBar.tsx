"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/calendrier", label: "Calendrier", emoji: "📅" },
  { href: "/recettes", label: "Recettes", emoji: "📖" },
  { href: "/courses", label: "Courses", emoji: "🛒" },
  { href: "/reglages", label: "Réglages", emoji: "⚙️" },
];

const HIDDEN_PREFIXES = ["/login", "/signup", "/reset", "/onboarding", "/rejoindre"];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }

  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line/80 bg-parchment/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/calendrier" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold text-ink">
            {APP_NAME}
          </span>
          <span className="hidden text-xs uppercase tracking-widest text-ink-soft sm:inline">
            · {APP_TAGLINE}
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-ink text-parchment"
                    : "text-ink-soft hover:bg-parchment-deep hover:text-ink"
                }`}
              >
                <span aria-hidden className="mr-1">
                  {l.emoji}
                </span>
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
          <button
            onClick={signOut}
            title="Se déconnecter"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-parchment-deep hover:text-ink"
          >
            <span aria-hidden className="mr-1">
              ⏻
            </span>
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
