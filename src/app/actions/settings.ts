"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .nullish();

const settingsSchema = z.object({
  servings: z.coerce.number().int().min(1).max(50),
  allergies: z.array(z.string().trim().min(1)),
  forbidden: z.array(z.string().trim().min(1)),
  bgColor: hexColor,
  cardColor: hexColor,
  accentColor: hexColor,
});

export async function saveSettings(input: unknown) {
  const data = settingsSchema.parse(input);
  const values = {
    servings: data.servings,
    allergies: data.allergies,
    forbidden: data.forbidden,
    bgColor: data.bgColor ?? null,
    cardColor: data.cardColor ?? null,
    accentColor: data.accentColor ?? null,
  };
  await prisma.settings.upsert({
    where: { id: "household" },
    create: { id: "household", ...values },
    update: values,
  });
  revalidatePath("/reglages");
  revalidatePath("/calendrier");
  revalidatePath("/courses");
  return { ok: true };
}
