import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const endpoint = body?.endpoint;
  if (!endpoint) {
    return NextResponse.json({ ok: false, error: "endpoint manquant" }, { status: 400 });
  }
  await prisma.pushSub.deleteMany({ where: { endpoint } });
  return NextResponse.json({ ok: true });
}
