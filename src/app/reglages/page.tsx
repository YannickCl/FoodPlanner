import { getSettings } from "@/lib/queries";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function ReglagesPage() {
  const settings = await getSettings();
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
    </div>
  );
}
