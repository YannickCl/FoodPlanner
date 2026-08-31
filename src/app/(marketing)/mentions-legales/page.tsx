import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import { LegalPage, Section, Todo } from "../_components/legal-ui";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales de ${APP_NAME} : éditeur, hébergement et responsabilité.`,
  alternates: { canonical: "/mentions-legales" },
};

const CONTACT = "contact@chillmeals.fr";

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      subtitle={`Informations légales relatives au site et au service ${APP_NAME}.`}
      updated="31 août 2026"
    >
      <Section title="Éditeur">
        <p>
          Le site {APP_NAME} (accessible à l’adresse {SITE_URL.replace(/^https?:\/\//, "")})
          est édité par <strong>Yannick Clément</strong>, entrepreneur individuel
          (micro-entreprise).
        </p>
        <p>
          SIRET : 890 501 315 00034 — Adresse : 53 rue Saint-Martin, 33720 Landiras,
          France — Contact :{" "}
          <a className="underline" href={`mailto:${CONTACT}`}>
            {CONTACT}
          </a>
          .
        </p>
        <p>
          TVA : non applicable, article 293 B du Code général des impôts (franchise en
          base de TVA) — <Todo>à confirmer selon votre régime</Todo>.
        </p>
      </Section>

      <Section title="Directeur de la publication">
        <p>Yannick Clément.</p>
      </Section>

      <Section title="Hébergement">
        <p>
          Le site et l’application sont hébergés par <strong>Vercel Inc.</strong>, 340 S
          Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com).
        </p>
        <p>
          Les données applicatives (comptes, contenus) sont hébergées et gérées via{" "}
          <strong>Supabase Inc.</strong> Voir la{" "}
          <Link className="underline" href="/confidentialite">
            politique de confidentialité
          </Link>{" "}
          pour la liste des sous-traitants.
        </p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          La marque {APP_NAME}, le logo, la charte graphique, les textes et les éléments
          du site sont protégés. Toute reproduction ou réutilisation sans autorisation
          est interdite. Les recettes et contenus que vous créez restent votre propriété.
        </p>
      </Section>

      <Section title="Responsabilité & avertissement">
        <p>
          {APP_NAME} est un outil d’organisation des repas. Les informations sur les{" "}
          <strong>allergènes</strong> et les recettes (y compris celles générées par
          intelligence artificielle) sont fournies <strong>à titre indicatif</strong> et
          ne constituent pas un avis médical ou nutritionnel. En cas d’allergie ou de
          régime spécifique, vérifiez toujours vous-même les ingrédients et les étiquettes
          des produits avant consommation.
        </p>
        <p>
          L’éditeur ne saurait être tenu responsable des conséquences liées à l’usage des
          informations fournies, ni des interruptions ou erreurs du service.
        </p>
      </Section>

      <Section title="Liens utiles">
        <p>
          <Link className="underline" href="/confidentialite">
            Politique de confidentialité
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/cgu">
            Conditions générales d’utilisation et de vente
          </Link>
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Pour toute question :{" "}
          <a className="underline" href={`mailto:${CONTACT}`}>
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
