import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { LegalPage, Section, Li, Todo } from "../_components/legal-ui";

export const metadata: Metadata = {
  title: "Conditions générales",
  description: `Conditions générales d’utilisation et de vente de ${APP_NAME}.`,
  alternates: { canonical: "/cgu" },
};

const CONTACT = "contact@chillmeals.fr";

export default function CguPage() {
  return (
    <LegalPage
      title="Conditions générales"
      subtitle={`Conditions générales d’utilisation et de vente de ${APP_NAME} (CGU/CGV).`}
      updated="31 août 2026"
    >
      <Section title="1. Objet">
        <p>
          Les présentes conditions régissent l’accès et l’utilisation du service {APP_NAME},
          une application d’organisation des repas (planning, recettes, listes de courses,
          batch cooking), éditée par Yannick Clément. Elles s’appliquent à tout
          utilisateur. En créant un compte, vous les acceptez.
        </p>
      </Section>

      <Section title="2. Compte">
        <p>
          La création d’un compte nécessite une adresse e-mail valide (ou une connexion
          Google). Vous êtes responsable de l’exactitude des informations, de la
          confidentialité de vos identifiants et de l’activité sur votre compte. Le
          service est réservé aux personnes majeures (ou mineurs sous responsabilité d’un
          parent/tuteur).
        </p>
      </Section>

      <Section title="3. Offres et tarifs">
        <ul className="space-y-1">
          <Li>
            <strong>Gratuit</strong> : accès aux fonctions de base (dans la limite de 30
            recettes).
          </Li>
          <Li>
            <strong>Premium</strong> : <strong>5,99 € / mois</strong> ou{" "}
            <strong>60 € / an</strong> (TTC), avec un <strong>essai gratuit de 7 jours</strong>.
            Débloque l’assistant IA, le planning automatique et le batch cooking.
          </Li>
        </ul>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. L’éditeur peut faire
          évoluer les tarifs ; les abonnements en cours ne sont pas affectés avant leur
          renouvellement, moyennant information préalable.
        </p>
      </Section>

      <Section title="4. Paiement, reconduction et résiliation">
        <p>
          Le paiement est traité par <strong>Stripe</strong>. L’abonnement est{" "}
          <strong>reconduit automatiquement</strong> à échéance (mensuelle ou annuelle)
          jusqu’à résiliation. Vous pouvez <strong>résilier à tout moment</strong> depuis
          l’espace « Réglages » ; la résiliation prend effet à la fin de la période en
          cours, sans remboursement du temps restant. Aucun débit n’intervient pendant les
          7 jours d’essai si vous résiliez avant leur terme.
        </p>
      </Section>

      <Section title="5. Droit de rétractation">
        <p>
          {APP_NAME} est un service numérique fourni immédiatement. En souscrivant et en
          demandant l’accès immédiat (notamment via l’essai gratuit), vous demandez
          expressément l’exécution du service avant la fin du délai de rétractation de 14
          jours et reconnaissez perdre ce droit une fois le service pleinement fourni,
          conformément à l’article L.221-28 du Code de la consommation. Vous conservez la
          possibilité de résilier à tout moment (article 4).
        </p>
      </Section>

      <Section title="6. Contenu généré par IA & avertissement">
        <p>
          Certaines recettes sont générées par intelligence artificielle et fournies « en
          l’état », à titre indicatif. Les informations sur les allergènes et la nutrition
          ne constituent pas un avis médical. <strong>Vérifiez toujours les ingrédients et
          les étiquettes</strong> avant préparation et consommation, en particulier en cas
          d’allergie ou de régime spécifique. L’éditeur décline toute responsabilité à cet
          égard.
        </p>
      </Section>

      <Section title="7. Utilisation acceptable">
        <p>Vous vous engagez à ne pas :</p>
        <ul className="space-y-1">
          <Li>utiliser le service à des fins illicites ou frauduleuses ;</Li>
          <Li>revendre, copier ou exploiter le service sans autorisation ;</Li>
          <Li>
            porter atteinte au fonctionnement, à la sécurité ou aux données d’autres
            utilisateurs.
          </Li>
        </ul>
        <p>
          En cas de manquement, l’éditeur peut suspendre ou supprimer le compte concerné.
        </p>
      </Section>

      <Section title="8. Disponibilité">
        <p>
          L’éditeur s’efforce d’assurer la disponibilité du service mais ne garantit pas
          une continuité sans interruption (maintenance, incidents, dépendances tierces).
        </p>
      </Section>

      <Section title="9. Propriété intellectuelle">
        <p>
          Le service, sa marque et ses éléments sont protégés. Les contenus que vous créez
          restent votre propriété ; vous accordez à l’éditeur les droits techniques
          nécessaires pour les héberger et vous les afficher.
        </p>
      </Section>

      <Section title="10. Responsabilité">
        <p>
          Le service est fourni « en l’état ». Dans les limites permises par la loi, la
          responsabilité de l’éditeur est limitée aux dommages directs et prévisibles, et
          ne saurait excéder les sommes versées au titre de l’abonnement sur les 12
          derniers mois.
        </p>
      </Section>

      <Section title="11. Données personnelles">
        <p>
          Le traitement de vos données est décrit dans la{" "}
          <Link className="underline" href="/confidentialite">
            politique de confidentialité
          </Link>
          .
        </p>
      </Section>

      <Section title="12. Modification des conditions">
        <p>
          L’éditeur peut modifier les présentes conditions. Les changements substantiels
          seront portés à votre connaissance ; la poursuite de l’utilisation vaut
          acceptation.
        </p>
      </Section>

      <Section title="13. Droit applicable et litiges">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de litige, vous
          pouvez recourir gratuitement à un médiateur de la consommation :{" "}
          <Todo>médiateur à désigner</Todo>. À défaut d’accord amiable, les tribunaux
          français sont compétents. Plateforme européenne de règlement des litiges :
          ec.europa.eu/consumers/odr.
        </p>
      </Section>

      <Section title="14. Contact">
        <p>
          <a className="underline" href={`mailto:${CONTACT}`}>
            {CONTACT}
          </a>
        </p>
      </Section>
    </LegalPage>
  );
}
