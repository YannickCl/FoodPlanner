import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { getSettings } from "@/lib/queries";
import { OnboardingWizard } from "./OnboardingWizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const householdId = await getCurrentHouseholdId();
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    select: { name: true, onboardedAt: true },
  });
  if (household?.onboardedAt) redirect("/calendrier");

  const settings = await getSettings();
  return (
    <OnboardingWizard
      initial={{
        householdName: household?.name && household.name !== "Mon foyer" ? household.name : "",
        servings: settings.servings,
        allergies: settings.allergies,
        forbidden: settings.forbidden,
        lunchTime: settings.lunchTime,
        lunchEnabled: settings.lunchEnabled,
        dinnerTime: settings.dinnerTime,
        dinnerEnabled: settings.dinnerEnabled,
      }}
    />
  );
}
