import * as Sentry from "@sentry/nextjs";

// Suivi d'erreurs côté serveur. DSN public (gravé, surchargable par l'env).
// Actif uniquement en production (aucun envoi en dev local).
Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://ecef1b1cc8b09b513785989eb75641c2@o4512007696809984.ingest.de.sentry.io/4512007722238032",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV ?? "production",
});
