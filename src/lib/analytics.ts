// Mesure d'audience via Google Tag Manager (+ GA4 configuré dans GTM).
// Dormant tant que NEXT_PUBLIC_GTM_ID n'est pas défini : aucun script chargé,
// aucun bandeau affiché, aucun cookie posé.
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

// Clé de stockage du choix de consentement (par navigateur).
export const CONSENT_KEY = "cm-consent"; // "granted" | "denied"

// Événement émis quand le consentement change (accepter/refuser dans le bandeau)
// pour que les traceurs déjà montés (ex. Pinterest) réagissent sans rechargement.
export const CONSENT_EVENT = "cm-consent-changed";

// Tag Pinterest (suivi de conversions / retargeting). Valeur publique, codée en
// dur volontairement (comme le DSN Sentry) : chargée uniquement APRÈS
// consentement, jamais avant. Vider la chaîne désactive complètement Pinterest.
export const PINTEREST_TAG_ID = "2613277902338";
