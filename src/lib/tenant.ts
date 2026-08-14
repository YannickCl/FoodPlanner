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
    // Course possible (double 1ʳᵉ requête) : l'utilisateur a été créé entre-temps.
    const u = await prisma.user.findUnique({
      where: { id: user.id },
      select: { householdId: true },
    });
    if (u) return u.householdId;
    throw new Error("Impossible de créer le foyer.");
  }
}
