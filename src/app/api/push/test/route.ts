import { NextResponse } from "next/server";
import { sendToAll } from "@/lib/push";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { APP_NAME } from "@/lib/brand";

export async function POST() {
  // Auth obligatoire + envoi restreint au foyer courant :
  // sans cela, n'importe quel compte pourrait notifier tous les foyers.
  let householdId: string;
  try {
    householdId = await getCurrentHouseholdId();
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const res = await sendToAll(
      {
        title: `🍳 ${APP_NAME}`,
        body: "Test réussi ! Les rappels de cuisine sont bien activés.",
        url: "/calendrier",
        tag: "test",
      },
      { householdId },
    );
    return NextResponse.json({ ok: true, ...res });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erreur" },
      { status: 500 },
    );
  }
}
