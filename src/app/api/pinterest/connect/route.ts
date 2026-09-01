import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Étape 1 (one-time) : redirige vers l'écran d'autorisation Pinterest.
// Protégé par ?key=<CRON_SECRET> pour éviter que n'importe qui l'initie.
export function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const key = new URL(req.url).searchParams.get("key");
  if (!secret || key !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const appId = process.env.PINTEREST_APP_ID;
  if (!appId) {
    return NextResponse.json(
      { ok: false, error: "PINTEREST_APP_ID manquant" },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: `${SITE_URL}/api/pinterest/callback`,
    response_type: "code",
    scope: "boards:read,pins:read,pins:write",
    state: "chillmeals",
  });
  return NextResponse.redirect(`https://www.pinterest.com/oauth/?${params.toString()}`);
}
