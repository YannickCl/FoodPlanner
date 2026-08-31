import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Callback OAuth (ex. Google) : échange le code contre une session, puis route.
// - `next` interne fourni (ex. invitation) -> on y va tel quel
// - sinon : nouveau compte (pas encore de foyer) -> onboarding ; sinon -> calendrier
// Tout est encapsulé : en cas d'échec, on redirige proprement vers /login (jamais de 500).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || origin;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const fail = NextResponse.redirect(`${base}/login?error=oauth`);

  if (searchParams.get("error") || !code) return fail;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) return fail;

    // Destination interne explicite (invitation) — on refuse les URLs externes
    // et protocol-relative (//evil.com) pour éviter tout open-redirect.
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      return NextResponse.redirect(`${base}${next}`);
    }

    // Nouveau compte (pas encore de foyer) -> onboarding ; sinon -> calendrier.
    // Si la requête DB échoue, on évite l'onboarding (le foyer sera provisionné
    // au 1er accès) plutôt que de casser la connexion.
    let known = true;
    try {
      known = !!(await prisma.user.findUnique({
        where: { id: data.user.id },
        select: { id: true },
      }));
    } catch {
      known = true;
    }
    return NextResponse.redirect(`${base}${known ? "/calendrier" : "/onboarding"}`);
  } catch {
    return fail;
  }
}
