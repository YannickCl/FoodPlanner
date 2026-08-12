import { getSettings } from "@/lib/queries";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function ReglagesPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-3xl text-ink">⚙️ Réglages</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Ces réglages s’appliquent partout : génération du planning, liste de
        courses et suggestions de l’IA.
      </p>
      <SettingsForm
        initial={{
          servings: settings.servings,
          allergies: settings.allergies,
          forbidden: settings.forbidden,
        }}
      />
    </div>
  );
}
