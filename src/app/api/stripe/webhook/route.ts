import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function setPlan(customerId: string, premium: boolean, status: string) {
  await prisma.household.updateMany({
    where: { stripeCustomerId: customerId },
    data: { plan: premium ? "PREMIUM" : "FREE", subscriptionStatus: status },
  });
}

// Un abonnement "actif" (premium) tant qu'il est en cours, en essai, ou en léger retard.
const ACTIVE = ["active", "trialing", "past_due"];

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "config" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.customer) await setPlan(String(s.customer), true, "active");
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await setPlan(String(sub.customer), ACTIVE.includes(sub.status), sub.status);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await setPlan(String(sub.customer), false, "canceled");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
