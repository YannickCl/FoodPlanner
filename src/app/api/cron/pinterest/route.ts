import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { runPinterestPublish } from "@/lib/pinterest/publish";

export const dynamic = "force-dynamic";

/** Autorisé si header Authorization: Bearer <CRON_SECRET> ou ?key=<CRON_SECRET>. */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  const key = new URL(req.url).searchParams.get("key");
  return key === secret;
}

async function handle(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const res = await runPinterestPublish();
    return NextResponse.json(res);
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erreur" },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
