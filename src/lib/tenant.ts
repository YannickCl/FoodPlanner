import "server-only";
import { prisma } from "./db";

/**
 * Foyer courant. Transition Phase 0.2 : pas encore d'authentification, on renvoie
 * le foyer fondateur (le seul existant). En Phase 0.1, l'implémentation lira l'ID
 * depuis la session Supabase — tout le reste du code passe déjà par cette fonction.
 */
export async function getCurrentHouseholdId(): Promise<string> {
  const h = await prisma.household.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!h) {
    throw new Error("Aucun foyer trouvé — la migration Phase 0 n'a pas été exécutée.");
  }
  return h.id;
}
