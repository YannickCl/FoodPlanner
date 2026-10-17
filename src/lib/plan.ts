// Mode « lancement gratuit » (phase d'acquisition).
//
// Tant que LAUNCH_FREE === "true", TOUS les foyers ont l'accès complet (premium)
// sans paiement : recettes illimitées, IA, planning auto, batch cooking. Objectif
// : zéro friction pour aller chercher les premiers utilisateurs.
//
// Pour repasser au modèle payant plus tard : mettre LAUNCH_FREE à false (ou
// retirer la variable). Les foyers déjà inscrits pendant la phase gratuite
// pourront être « grandfathered » (passés en PREMIUM) par une opération
// ponctuelle à ce moment-là — rien à coder d'ici là.
export const LAUNCH_FREE = process.env.LAUNCH_FREE === "true";

/** Le foyer a-t-il l'accès premium ? (abonné Stripe OU mode lancement gratuit) */
export function premiumActive(plan?: string | null): boolean {
  return LAUNCH_FREE || plan === "PREMIUM";
}
