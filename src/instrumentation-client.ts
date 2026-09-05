import * as Sentry from "@sentry/nextjs";
import { STALE_DEPLOY_RE } from "@/lib/stale-deploy";

// Suivi d'erreurs côté navigateur. DSN public gravé, actif en production.
Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://ecef1b1cc8b09b513785989eb75641c2@o4512007696809984.ingest.de.sentry.io/4512007722238032",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  integrations: [
    // Rejeu de session UNIQUEMENT lors d'une erreur : texte, saisies et médias
    // masqués (aucune donnée personnelle enregistrée). Voir /confidentialite.
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
  // Aucun enregistrement en continu ; on ne rejoue que les instants précédant
  // une erreur, pour diagnostiquer (intérêt légitime, volume minimal).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production",
  // Ignore l'erreur bénigne « Server Action introuvable » : elle survient quand
  // un onglet chargé avant un redéploiement appelle une ancienne action. Se
  // soigne en rechargeant (voir AppUpdateReloader) — inutile de la remonter,
  // et surtout de consommer un rejeu de session pour ça.
  beforeSend(event, hint) {
    const msg =
      (hint?.originalException as { message?: string } | undefined)?.message ??
      event.exception?.values?.[0]?.value ??
      "";
    if (STALE_DEPLOY_RE.test(msg)) return null;
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
