"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { toggleCheckSchema } from "@/lib/validation";
import { isoToDbDate } from "@/lib/dates";
import { getCurrentHouseholdId } from "@/lib/tenant";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Coche/décoche un ingrédient de la liste de courses (persisté par période). */
export async function toggleCheck(input: unknown) {
  const data = toggleCheckSchema.parse(input);
  const householdId = await getCurrentHouseholdId();
  const rangeStart = isoToDbDate(data.rangeStart);
  const rangeEnd = isoToDbDate(data.rangeEnd);

  await prisma.shoppingListCheck.upsert({
    where: {
      householdId_rangeStart_rangeEnd_ingredientKey: {
        householdId,
        rangeStart,
        rangeEnd,
        ingredientKey: data.ingredientKey,
      },
    },
    create: {
      householdId,
      rangeStart,
      rangeEnd,
      ingredientKey: data.ingredientKey,
      checked: data.checked,
    },
    update: { checked: data.checked },
  });

  revalidatePath("/courses");
  return { ok: true };
}

// --- Articles ajoutés à la main ---

const addExtraSchema = z.object({
  rangeStart: isoDate,
  rangeEnd: isoDate,
  name: z.string().trim().min(1).max(120),
});

export async function addExtra(input: unknown) {
  const data = addExtraSchema.parse(input);
  const householdId = await getCurrentHouseholdId();
  const extra = await prisma.shoppingExtra.create({
    data: {
      householdId,
      rangeStart: isoToDbDate(data.rangeStart),
      rangeEnd: isoToDbDate(data.rangeEnd),
      name: data.name,
    },
  });
  revalidatePath("/courses");
  return { ok: true, id: extra.id };
}

export async function toggleExtra(input: unknown) {
  const data = z
    .object({ id: z.string(), checked: z.boolean() })
    .parse(input);
  const householdId = await getCurrentHouseholdId();
  await prisma.shoppingExtra.updateMany({
    where: { id: data.id, householdId },
    data: { checked: data.checked },
  });
  revalidatePath("/courses");
  return { ok: true };
}

export async function deleteExtra(input: unknown) {
  const data = z.object({ id: z.string() }).parse(input);
  const householdId = await getCurrentHouseholdId();
  await prisma.shoppingExtra.deleteMany({ where: { id: data.id, householdId } });
  revalidatePath("/courses");
  return { ok: true };
}
