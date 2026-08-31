import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Pages publiques (accessibles sans être connecté).
const PUBLIC_PREFIXES = [
  "/login",
  "/signup",
  "/reset",
  "/rejoindre",
  "/auth/callback",
  // Vitrine (accessible sans compte)
  "/",
  "/tarifs",
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
  "/guide",
  "/planning-repas",
  "/liste-de-courses",
  "/batch-cooking",
  "/comparatif",
];

// Protège l'app derrière la session Supabase et rafraîchit les cookies de session.
// (Next 16 : convention "proxy", ex-"middleware".)
export async function proxy(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  const isPublic = PUBLIC_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/"),
  );

  // Pas connecté sur une page privée -> vers /login (en gardant la destination).
  if (!user && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Déjà connecté sur une page d'entrée d'auth -> vers l'app.
  // (On exclut /reset/update : on y arrive AVEC une session de récupération.)
  // ⚠️ Uniquement sur une navigation GET : sinon on redirige aussi les Server
  // Actions (POST) déclenchées depuis /signup — ex. joinHousehold juste après
  // signUp — ce qui casse l'action ("unexpected response from the server").
  const isAuthEntry = ["/login", "/signup", "/reset"].includes(path);
  if (user && isAuthEntry && req.method === "GET") {
    const url = req.nextUrl.clone();
    url.pathname = "/calendrier";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Tout sauf : assets Next, favicon, PWA (manifeste + service worker), cron, images.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|robots.txt|sitemap.xml|api/cron|api/stripe|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)",
  ],
};
