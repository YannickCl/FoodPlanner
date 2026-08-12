"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { z } from "zod";

const settingsSchema = z.object({
  servings: z.coerce.number().int().min(1).max(50),
  allergies: z.array(z.string().trim().min(1)),
  forbidden: z.array(z.string().trim().min(1)),
});

export async function saveSettings(input: unknown) {
  const data = settingsSchema.parse(input);
  await prisma.settings.upsert({
    where: { id: "household" },
    create: { id: "household", ...data },
    update: data,
  });
  revalidatePath("/reglages");
  revalidatePath("/calendrier");
  revalidatePath("/courses");
  return { ok: true };
}
