import * as Sentry from "@sentry/nextjs";

// Suivi d'erreurs côté navigateur. DSN public gravé, actif en production.
Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://ecef1b1cc8b09b513785989eb75641c2@o4512007696809984.ingest.de.sentry.io/4512007722238032",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  // Pas de session replay pour l'instant (respect vie privée + quota).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production",
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
