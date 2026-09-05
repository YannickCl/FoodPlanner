import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Origine Supabase dérivée de l'env (REST/Auth en https, realtime en wss).
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin;
  } catch {
    return "";
  }
})();
const supabaseWs = supabaseOrigin.replace(/^https/, "wss");

const isDev = process.env.NODE_ENV !== "production";

// Domaines Google Tag Manager / Analytics (mesure d'audience).
const GTM = "https://www.googletagmanager.com https://*.googletagmanager.com";
const GA =
  "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com";

// Domaines Pinterest Tag : core.js (s.pinimg.com) + endpoint de conversion
// (ct.pinterest.com). Chargés uniquement après consentement côté client.
const PINTEREST_SCRIPT = "https://s.pinimg.com";
const PINTEREST_CT = "https://ct.pinterest.com";

// Content-Security-Policy. En prod : pas de 'unsafe-eval'. En dev on l'ajoute
// (React Refresh / HMR en ont besoin) ainsi que le websocket local du HMR.
// 'unsafe-inline' est requis pour les scripts inline de Next et notre snippet
// Consent Mode (pas de nonce ici) ; il bloque quand même tout script tiers non
// listé, qui est le principal vecteur d'injection.
const csp = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    isDev ? "'unsafe-eval'" : "",
    GTM,
    GA,
    PINTEREST_SCRIPT,
  ]
    .filter(Boolean)
    .join(" "),
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${GTM} ${GA} ${PINTEREST_SCRIPT} ${PINTEREST_CT}`,
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    supabaseOrigin,
    supabaseWs,
    GTM,
    GA,
    PINTEREST_CT, // Pinterest Tag : envoi des conversions
    "https://*.sentry.io", // suivi d'erreurs Sentry (ingestion)
    isDev ? "ws://localhost:* http://localhost:*" : "",
  ]
    .filter(Boolean)
    .join(" "),
  `frame-src 'self' ${GTM}`,
  "worker-src 'self' blob:", // Sentry Session Replay compresse via un worker (blob:)
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

// En-têtes de sécurité appliqués à toutes les routes.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// Sentry : instrumentation runtime toujours active (dormante sans DSN) ; l'upload
// des source maps ne se fait que si SENTRY_ORG/PROJECT/AUTH_TOKEN sont fournis.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  disableLogger: true,
});
