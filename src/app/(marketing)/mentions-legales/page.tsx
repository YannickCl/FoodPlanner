import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-display text-4xl text-ink">Mentions légales</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Informations légales et politique de confidentialité de {APP_NAME}.
      </p>

      <div className="mb-6 rounded-xl border border-brick/30 bg-brick/10 px-4 py-3 text-sm text-brick">
        ⚠️ Document provisoire — à faire valider par un professionnel du droit avant
        l’ouverture au public (RGPD, CGU, responsabilité).
      </div>

      <Card className="space-y-6 p-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="mb-1 font-display text-lg text-ink">Éditeur</h2>
          <p className="text-ink-soft">
            {APP_NAME} — [Raison sociale / nom], [adresse], [SIREN]. Contact :
            [email]. Directeur de la publication : [nom].
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display text-lg text-ink">Hébergement</h2>
          <p className="text-ink-soft">
            Application hébergée par Vercel Inc. Base de données hébergée par Supabase
            (région Europe).
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display text-lg text-ink">Données personnelles (RGPD)</h2>
          <p className="text-ink-soft">
            {APP_NAME} collecte l’adresse e-mail (compte) et les données que tu saisis
            (recettes, planning, réglages) pour fournir le service. Tu peux demander
            l’accès, la rectification ou la suppression de tes données à [email].
            [Détails à compléter : durée de conservation, sous-traitants, base légale.]
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display text-lg text-ink">Allergènes — avertissement</h2>
          <p className="text-ink-soft">
            Les informations sur les allergènes sont fournies à titre indicatif. Malgré
            nos vérifications, {APP_NAME} ne peut garantir l’exhaustivité ou l’exactitude
            des informations des recettes. En cas d’allergie, vérifie toujours les
            ingrédients toi-même.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display text-lg text-ink">Conditions d’utilisation</h2>
          <p className="text-ink-soft">[CGU à compléter.]</p>
        </section>
      </Card>
    </div>
  );
}
