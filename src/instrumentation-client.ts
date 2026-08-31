import * as Sentry from "@sentry/nextjs";

// Suivi d'erreurs côté navigateur. Dormant tant que NEXT_PUBLIC_SENTRY_DSN est vide.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Pas de session replay pour l'instant (respect vie privée + quota).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
