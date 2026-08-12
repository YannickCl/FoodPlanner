"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { toggleCheckSchema } from "@/lib/validation";
import { isoToDbDate } from "@/lib/dates";

/** Coche/décoche un ingrédient de la liste de courses (persisté par période). */
export async function toggleCheck(input: unknown) {
  const data = toggleCheckSchema.parse(input);
  const rangeStart = isoToDbDate(data.rangeStart);
  const rangeEnd = isoToDbDate(data.rangeEnd);

  await prisma.shoppingListCheck.upsert({
    where: {
      rangeStart_rangeEnd_ingredientKey: {
        rangeStart,
        rangeEnd,
        ingredientKey: data.ingredientKey,
      },
    },
    create: {
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
