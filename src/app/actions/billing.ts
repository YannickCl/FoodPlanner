"use server";

import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

async function baseUrl(): Promise<string> {
  // Priorité au domaine configuré (fiable) plutôt qu'à l'en-tête Host (spoofable)
  // pour les URLs de retour Stripe.
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Ouvre un Checkout Stripe pour passer le foyer en premium. */
export async function createCheckoutSession(
  interval: "monthly" | "annual",
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const householdId = await getCurrentHouseholdId();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const price =
    interval === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL
      : process.env.STRIPE_PRICE_MONTHLY;
  if (!price) return { ok: false, error: "Tarif Stripe non configuré." };

  const household = await prisma.household.findUnique({
    where: { id: householdId },
    select: { stripeCustomerId: true },
  });

  try {
    let customerId = household?.stripeCustomerId ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { householdId },
      });
      customerId = customer.id;
      await prisma.household.update({
        where: { id: householdId },
        data: { stripeCustomerId: customerId },
      });
    }

    const url = await baseUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      subscription_data: { trial_period_days: 7, metadata: { householdId } },
      allow_promotion_codes: true,
      success_url: `${url}/reglages?abonnement=ok`,
      cancel_url: `${url}/reglages?abonnement=annule`,
    });
    return { ok: true, url: session.url ?? undefined };
  } catch (e) {
    // Ex. prix Stripe invalide/mal configuré : on renvoie une erreur propre
    // (au lieu de planter la page) et on la trace dans Sentry.
    Sentry.captureException(e);
    return {
      ok: false,
      error: "Le paiement est momentanément indisponible. Réessaie dans un instant.",
    };
  }
}

/** Ouvre le portail Stripe pour gérer / résilier l'abonnement. */
export async function createPortalSession(): Promise<{
  ok: boolean;
  url?: string;
  error?: string;
}> {
  const householdId = await getCurrentHouseholdId();
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    select: { stripeCustomerId: true },
  });
  if (!household?.stripeCustomerId) return { ok: false, error: "Aucun abonnement à gérer." };

  const url = await baseUrl();
  const portal = await stripe.billingPortal.sessions.create({
    customer: household.stripeCustomerId,
    return_url: `${url}/reglages`,
  });
  return { ok: true, url: portal.url };
}
