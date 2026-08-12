import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Protège toutes les pages derrière le mot de passe du foyer, sauf /login et
// les ressources publiques. (Next 16 : convention "proxy", ex-"middleware".)
export async function proxy(req: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? "";
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(secret, token);

  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Tout sauf : login, assets Next, favicon, PWA (manifeste + service worker),
  // le cron des rappels (protégé par son propre secret) et fichiers statiques.
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|api/cron|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)",
  ],
};
