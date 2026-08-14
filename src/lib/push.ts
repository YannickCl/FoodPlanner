import "server-only";
import webpush from "web-push";
import { prisma } from "@/lib/db";

let configured = false;

function configure() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contact@example.com";
  if (!publicKey || !privateKey) {
    throw new Error("Clés VAPID manquantes (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).");
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/**
 * Envoie une notification aux appareils abonnés. Nettoie les abonnements morts.
 * `opts.householdId` restreint l'envoi aux appareils d'un foyer (multi-foyers).
 */
export async function sendToAll(
  payload: PushPayload,
  opts?: { householdId?: string },
): Promise<{ sent: number; removed: number }> {
  configure();
  const subs = await prisma.pushSub.findMany({
    where: opts?.householdId ? { householdId: opts.householdId } : undefined,
  });
  const data = JSON.stringify(payload);
  let sent = 0;
  const dead: string[] = [];

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          data,
        );
        sent++;
      } catch (err: unknown) {
        const code = (err as { statusCode?: number }).statusCode;
        // 404/410 = abonnement expiré ou révoqué -> on le supprime
        if (code === 404 || code === 410) dead.push(s.endpoint);
      }
    }),
  );

  if (dead.length) {
    await prisma.pushSub.deleteMany({ where: { endpoint: { in: dead } } });
  }
  return { sent, removed: dead.length };
}
