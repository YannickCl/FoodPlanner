"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function genCode(): string {
  return randomBytes(6).toString("hex"); // 12 caractères, non devinable
}

/** Génère (si besoin) et renvoie le code d'invitation du foyer courant. */
export async function getInviteCode(): Promise<{ code: string }> {
  const householdId = await getCurrentHouseholdId();
  const h = await prisma.household.findUnique({
    where: { id: householdId },
    select: { inviteCode: true },
  });
  if (h?.inviteCode) return { code: h.inviteCode };
  const code = genCode();
  await prisma.household.update({ where: { id: householdId }, data: { inviteCode: code } });
  revalidatePath("/reglages");
  return { code };
}

/** Régénère le code (invalide l'ancien lien). */
export async function regenerateInviteCode(): Promise<{ code: string }> {
  const householdId = await getCurrentHouseholdId();
  const code = genCode();
  await prisma.household.update({ where: { id: householdId }, data: { inviteCode: code } });
  revalidatePath("/reglages");
  return { code };
}

/** Rattache l'utilisateur connecté au foyer désigné par le code. */
export async function joinHousehold(
  code: string,
): Promise<{ ok: boolean; error?: string; name?: string }> {
  const clean = code.trim().toLowerCase();
  if (!clean) return { ok: false, error: "Code manquant." };

  const target = await prisma.household.findUnique({
    where: { inviteCode: clean },
    select: { id: true, name: true },
  });
  if (!target) return { ok: false, error: "Code d'invitation invalide." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const existing = await prisma.user.findUnique({
    where: { id: user.id },
    select: { householdId: true },
  });

  if (existing) {
    if (existing.householdId === target.id) return { ok: true, name: target.name };
    const old = existing.householdId;
    await prisma.user.update({
      where: { id: user.id },
      data: { householdId: target.id, role: "member" },
    });
    // Supprime l'ancien foyer s'il est vide (aucun autre membre, ni recette, ni repas).
    if ((await prisma.user.count({ where: { householdId: old } })) === 0) {
      const recipes = await prisma.recipe.count({ where: { householdId: old } });
      const meals = await prisma.plannedMeal.count({ where: { householdId: old } });
      if (recipes === 0 && meals === 0) {
        await prisma.household.delete({ where: { id: old } }).catch(() => {});
      }
    }
  } else {
    await prisma.user.create({
      data: { id: user.id, email: user.email ?? "", householdId: target.id, role: "member" },
    });
  }

  revalidatePath("/calendrier");
  return { ok: true, name: target.name };
}

/** Membres du foyer courant. */
export async function getHouseholdMembers() {
  const householdId = await getCurrentHouseholdId();
  return prisma.user.findMany({
    where: { householdId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, role: true },
  });
}

/** Le propriétaire retire un membre : il repart dans un nouveau foyer vide. */
export async function removeMember(
  userId: string,
): Promise<{ ok: boolean; error?: string }> {
  const householdId = await getCurrentHouseholdId();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const me = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, householdId: true },
  });
  if (me?.householdId !== householdId || me.role !== "owner") {
    return { ok: false, error: "Réservé au propriétaire du foyer." };
  }
  if (userId === user.id) {
    return { ok: false, error: "Tu ne peux pas te retirer toi-même (utilise « Quitter »)." };
  }
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { householdId: true, role: true },
  });
  if (!target || target.householdId !== householdId) {
    return { ok: false, error: "Membre introuvable." };
  }
  if (target.role === "owner") {
    return { ok: false, error: "Impossible de retirer un propriétaire." };
  }

  const fresh = await prisma.household.create({
    data: { name: "Mon foyer", onboardedAt: new Date() },
  });
  await prisma.user.update({
    where: { id: userId },
    data: { householdId: fresh.id, role: "owner" },
  });
  revalidatePath("/reglages");
  return { ok: true };
}

/** L'utilisateur courant quitte le foyer (repart dans un nouveau foyer vide). */
export async function leaveHousehold(): Promise<{ ok: boolean; error?: string }> {
  const householdId = await getCurrentHouseholdId();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const members = await prisma.user.findMany({
    where: { householdId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true },
  });
  if (members.length <= 1) {
    return { ok: false, error: "Tu es seul dans ce foyer : il n'y a rien à quitter." };
  }
  const me = members.find((m) => m.id === user.id);
  // Si je pars et que je suis propriétaire, je promeus le plus ancien autre membre.
  if (me?.role === "owner") {
    const next = members.find((m) => m.id !== user.id);
    if (next) await prisma.user.update({ where: { id: next.id }, data: { role: "owner" } });
  }
  const fresh = await prisma.household.create({
    data: { name: "Mon foyer", onboardedAt: new Date() },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { householdId: fresh.id, role: "owner" },
  });
  revalidatePath("/reglages");
  revalidatePath("/calendrier");
  return { ok: true };
}
