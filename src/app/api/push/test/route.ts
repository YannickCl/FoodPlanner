import { NextResponse } from "next/server";
import { sendToAll } from "@/lib/push";

export async function POST() {
  try {
    const res = await sendToAll({
      title: "🍳 Food Planner",
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
