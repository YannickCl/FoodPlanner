import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Callback OAuth (ex. Google) : échange le code contre une session, puis route.
// - `next` interne fourni (ex. invitation) -> on y va tel quel
// - sinon : nouveau compte (pas encore de foyer) -> onboarding ; sinon -> calendrier
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || origin;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (searchParams.get("error") || !code) {
    return NextResponse.redirect(`${base}/login?error=oauth`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${base}/login?error=oauth`);
  }

  // Destination interne explicite (invitation) — on refuse les URLs externes
  // et protocol-relative (//evil.com) pour éviter tout open-redirect.
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return NextResponse.redirect(`${base}${next}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const known =
    user &&
    (await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    }));
  return NextResponse.redirect(`${base}${known ? "/calendrier" : "/onboarding"}`);
}
