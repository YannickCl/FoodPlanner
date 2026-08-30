// Mesure d'audience via Google Tag Manager (+ GA4 configuré dans GTM).
// Dormant tant que NEXT_PUBLIC_GTM_ID n'est pas défini : aucun script chargé,
// aucun bandeau affiché, aucun cookie posé.
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

// Clé de stockage du choix de consentement (par navigateur).
export const CONSENT_KEY = "cm-consent"; // "granted" | "denied"
