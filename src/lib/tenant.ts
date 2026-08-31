import "server-only";
import { prisma } from "./db";
import { createSupabaseServerClient } from "./supabase/server";

/**
 * Foyer de l'utilisateur connecté. Lit la session Supabase, puis retrouve le
 * foyer via la table User. Au tout premier accès (juste après l'inscription),
 * crée le foyer + l'utilisateur (idempotent).
 */
export async function getCurrentHouseholdId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié.");

  const existing = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });
  if (existing) return existing.householdId;

  // Provisionnement : nouveau foyer + utilisateur propriétaire.
  try {
    return await prisma.$transaction(async (tx) => {
      const household = await tx.household.create({ data: { name: "Mon foyer" } });
      await tx.user.create({
        data: {
          id: user.id,
          email: user.email ?? "",
          householdId: household.id,
          role: "owner",
        },
      });
      return household.id;
    });
  } catch {
    // 1) Course possible (double 1ʳᵉ requête) : l'utilisateur a été créé entre-temps.
    const byId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true },
    });
    if (byId) return byId.householdId;

    // 2) Conflit d'e-mail (email @unique) : un compte existe déjà avec cet e-mail
    //    sous un autre identifiant d'auth — typiquement compte e-mail/mot de passe
    //    PUIS connexion Google (même adresse). C'est la même personne : on rattache
    //    ce compte à la session courante (mise à jour de l'id) plutôt que planter.
    if (user.email) {
      const byEmail = await prisma.user.findUnique({
        where: { email: user.email },
        select: { householdId: true },
      });
      if (byEmail) {
        await prisma.user.update({
          where: { email: user.email },
          data: { id: user.id },
        });
        return byEmail.householdId;
      }
    }
    throw new Error("Impossible de créer le foyer.");
  }
}
