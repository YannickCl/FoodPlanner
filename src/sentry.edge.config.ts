import * as Sentry from "@sentry/nextjs";

// Suivi d'erreurs côté edge (middleware). Dormant tant que le DSN est vide.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV ?? "development",
});
