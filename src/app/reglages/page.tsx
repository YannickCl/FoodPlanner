import { getSettings } from "@/lib/queries";
import { getCurrentHouseholdId } from "@/lib/tenant";
import { getHouseholdMembers } from "@/app/actions/household";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";
import { RemindersCard } from "./RemindersCard";
import { MembersCard } from "./MembersCard";
import { SubscriptionCard } from "./SubscriptionCard";

export const dynamic = "force-dynamic";

export default async function ReglagesPage() {
  const settings = await getSettings();
  const householdId = await getCurrentHouseholdId();
  const [household, members] = await Promise.all([
    prisma.household.findUnique({
      where: { id: householdId },
      select: { name: true, inviteCode: true, plan: true, stripeCustomerId: true },
    }),
    getHouseholdMembers(),
  ]);
  const {
    data: { user },
  } = await (await createSupabaseServerClient()).auth.getUser();
  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow mb-1">Votre foyer</p>
      <h1 className="mb-1 text-4xl text-ink">Réglages</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Ces réglages s’appliquent partout : génération du planning, liste de
        courses et suggestions de l’IA.
      </p>
      <SettingsForm
        initial={{
          servings: settings.servings,
          allergies: settings.allergies,
          forbidden: settings.forbidden,
          bgColor: settings.bgColor ?? "",
          cardColor: settings.cardColor ?? "",
          accentColor: settings.accentColor ?? "",
          lunchTime: settings.lunchTime,
          lunchEnabled: settings.lunchEnabled,
          dinnerTime: settings.dinnerTime,
          dinnerEnabled: settings.dinnerEnabled,
        }}
      />
      <div className="mt-4">
        <MembersCard
          householdName={household?.name ?? "Mon foyer"}
          initialCode={household?.inviteCode ?? null}
          members={members}
          currentUserId={user?.id ?? ""}
        />
      </div>
      <div className="mt-4">
        <SubscriptionCard
          premium={household?.plan === "PREMIUM"}
          hasStripeCustomer={!!household?.stripeCustomerId}
        />
      </div>
      <div className="mt-4">
        <RemindersCard />
      </div>
    </div>
  );
}
