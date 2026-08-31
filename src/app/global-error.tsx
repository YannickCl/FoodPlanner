"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Capture les erreurs qui remontent jusqu'à la racine (layout) vers Sentry,
// et affiche un écran de secours minimal.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

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
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Oups, une erreur est survenue</h1>
          <p style={{ color: "#8a8290", marginBottom: 16 }}>
            Réessaie dans un instant — l’incident a été signalé.
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
