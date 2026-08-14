import "server-only";
import Stripe from "stripe";

// Client Stripe (clé secrète en variable d'environnement). Le SDK refuse une clé
// vide : on met un remplaçant au build, la vraie clé est fournie à l'exécution.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_placeholder_build_only",
);

