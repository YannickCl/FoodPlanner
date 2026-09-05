"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { isStaleDeployMessage } from "@/lib/stale-deploy";

// Capture les erreurs qui remontent jusqu'à la racine (layout) vers Sentry,
// et affiche un écran de secours minimal.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  // Cas bénin « onglet périmé après un redéploiement » : message dédié, et on
  // ne le remonte pas à Sentry (beforeSend le filtre aussi, ceinture+bretelles).
  const staleDeploy = isStaleDeployMessage(error);

  useEffect(() => {
    if (!staleDeploy) Sentry.captureException(error);
  }, [error, staleDeploy]);

  return (
    <html lang="fr">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#433c48",
          background: "#faf6f3",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>
            {staleDeploy
              ? "Une nouvelle version est disponible"
              : "Oups, une erreur est survenue"}
          </h1>
          <p style={{ color: "#8a8290", marginBottom: 16 }}>
            {staleDeploy
              ? "L’application a été mise à jour. Recharge la page pour continuer."
              : "Réessaie dans un instant — l’incident a été signalé."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#c1913f",
              color: "#fff",
              border: 0,
              borderRadius: 9999,
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recharger
          </button>
        </div>
      </body>
    </html>
  );
}
