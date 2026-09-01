import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { exchangeToken } from "@/lib/pinterest/client";

export const dynamic = "force-dynamic";

// Étape 2 (one-time) : Pinterest redirige ici avec un `code`. On l'échange
// contre un refresh token, affiché UNE fois pour être copié dans Vercel
// (variable PINTEREST_REFRESH_TOKEN). Page en noindex, jamais indexée.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return page(`Autorisation refusée : ${escapeHtml(error)}`, null);
  }
  if (state !== "chillmeals" || !code) {
    return page("Requête invalide (state ou code manquant).", null);
  }

  try {
    const data = await exchangeToken({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${SITE_URL}/api/pinterest/callback`,
    });
    if (!data.refresh_token) {
      return page("Pinterest n'a pas renvoyé de refresh token.", null);
    }
    return page(null, data.refresh_token);
  } catch (e) {
    return page(e instanceof Error ? e.message : "Erreur d'échange de token", null);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function page(errorMsg: string | null, refreshToken: string | null): NextResponse {
  const body = refreshToken
    ? `<h1>✅ Pinterest connecté</h1>
       <p>Copie ce <strong>refresh token</strong> dans Vercel &rarr; Settings &rarr;
       Environment Variables, sous le nom <code>PINTEREST_REFRESH_TOKEN</code>
       (type <em>Secret</em>), puis redéploie.</p>
       <textarea readonly onclick="this.select()" style="width:100%;height:120px;font-family:monospace;font-size:13px;padding:12px;border:1px solid #ccc;border-radius:8px">${escapeHtml(
         refreshToken,
       )}</textarea>
       <p style="color:#b00">⚠️ Secret : ne le partage avec personne. Cette page ne le réaffichera pas.</p>`
    : `<h1>⚠️ Échec</h1><p>${escapeHtml(errorMsg ?? "Erreur inconnue")}</p>`;

  return new NextResponse(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8">
     <meta name="robots" content="noindex,nofollow">
     <meta name="viewport" content="width=device-width,initial-scale=1">
     <title>Connexion Pinterest</title></head>
     <body style="font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 20px;line-height:1.5;color:#333">
     ${body}</body></html>`,
    { status: refreshToken ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
