"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/tenant";

const time = z.string().regex(/^\d{2}:\d{2}$/);

const basicsSchema = z.object({
  householdName: z.string().trim().min(1).max(60),
  servings: z.coerce.number().int().min(1).max(50),
  allergies: z.array(z.string().trim().min(1)),
  forbidden: z.array(z.string().trim().min(1)),
  lunchTime: time,
  lunchEnabled: z.boolean(),
  dinnerTime: time,
  dinnerEnabled: z.boolean(),
});

/** Étapes 1-3 : nom du foyer + réglages (personnes, allergies, interdits, heures). */
export async function saveOnboardingBasics(input: unknown) {
  const data = basicsSchema.parse(input);
  const householdId = await getCurrentHouseholdId();

  await prisma.household.update({
    where: { id: householdId },
    data: { name: data.householdName },
  });

  const values = {
    servings: data.servings,
    allergies: data.allergies,
    forbidden: data.forbidden,
    lunchTime: data.lunchTime,
    lunchEnabled: data.lunchEnabled,
    dinnerTime: data.dinnerTime,
    dinnerEnabled: data.dinnerEnabled,
  };
  await prisma.settings.upsert({
    where: { householdId },
    create: { householdId, ...values },
    update: values,
  });
  return { ok: true };
}

/** Marque l'onboarding comme terminé. */
export async function completeOnboarding() {
  const householdId = await getCurrentHouseholdId();
  await prisma.household.update({
    where: { id: householdId },
    data: { onboardedAt: new Date() },
  });
  revalidatePath("/calendrier");
  return { ok: true };
}
