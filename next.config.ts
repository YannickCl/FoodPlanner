import type { NextConfig } from "next";

// En-têtes de sécurité appliqués à toutes les routes.
// NB : la Content-Security-Policy n'est PAS posée ici — elle sera ajoutée au
// lancement, une fois GTM/GA4 branchés (elle doit lister leurs domaines), pour
// éviter de casser le site avec une CSP incomplète.
const securityHeaders = [
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

export default nextConfig;
