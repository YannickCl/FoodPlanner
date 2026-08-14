import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/tenant";

export async function POST(req: Request) {
  const sub = await req.json().catch(() => null);
  const endpoint = sub?.endpoint;
  const p256dh = sub?.keys?.p256dh;
  const auth = sub?.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ ok: false, error: "Abonnement invalide" }, { status: 400 });
  }
  const householdId = await getCurrentHouseholdId();
  await prisma.pushSub.upsert({
    where: { endpoint },
    create: { householdId, endpoint, p256dh, auth },
    update: { householdId, p256dh, auth },
  });
  return NextResponse.json({ ok: true });
}
