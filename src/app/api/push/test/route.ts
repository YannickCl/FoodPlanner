import { NextResponse } from "next/server";
import { sendToAll } from "@/lib/push";
import { APP_NAME } from "@/lib/brand";

export async function POST() {
  try {
    const res = await sendToAll({
      title: `🍳 ${APP_NAME}`,
      body: "Test réussi ! Les rappels de cuisine sont bien activés.",
      url: "/calendrier",
      tag: "test",
    });
    return NextResponse.json({ ok: true, ...res });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erreur" },
      { status: 500 },
    );
  }
}
