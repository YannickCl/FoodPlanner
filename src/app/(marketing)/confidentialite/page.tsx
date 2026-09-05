import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { LegalPage, Section, Li } from "../_components/legal-ui";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment ${APP_NAME} collecte, utilise et protège vos données personnelles (RGPD).`,
  alternates: { canonical: "/confidentialite" },
};

const CONTACT = "contact@chillmeals.fr";

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle={`Protection de vos données personnelles chez ${APP_NAME} (RGPD).`}
      updated="5 septembre 2026"
    >
      <Section title="Responsable du traitement">
        <p>
          Yannick Clément, éditeur de {APP_NAME} (voir les{" "}
          <Link className="underline" href="/mentions-legales">
            mentions légales
          </Link>
          ). Contact :{" "}
          <a className="underline" href={`mailto:${CONTACT}`}>
            {CONTACT}
          </a>
          .
        </p>
      </Section>

      <Section title="Données que nous collectons">
        <ul className="space-y-1">
          <Li>
            <strong>Compte</strong> : adresse e-mail, et le cas échéant l’identifiant
            Google si vous utilisez la connexion Google. Le mot de passe est géré et
            chiffré par notre prestataire d’authentification (nous n’y avons pas accès).
          </Li>
          <Li>
            <strong>Contenu du foyer</strong> : nom du foyer, recettes, planning des
            repas, listes de courses, allergies et préférences alimentaires que vous
            saisissez.
          </Li>
          <Li>
            <strong>Abonnement</strong> : statut (gratuit / premium) et identifiant client
            de notre prestataire de paiement. <strong>Aucune donnée bancaire</strong>
            (numéro de carte) n’est stockée par {APP_NAME} : le paiement est traité
            directement par Stripe.
          </Li>
          <Li>
            <strong>Notifications</strong> : si vous les activez, un abonnement technique
            (push) pour les rappels de cuisine.
          </Li>
          <Li>
            <strong>Mesure d’audience</strong> : données de navigation via Google
            Analytics, <strong>uniquement si vous y consentez</strong> via le bandeau
            cookies.
          </Li>
          <Li>
            <strong>Suivi d’erreurs</strong> : en cas de bug, un rapport technique et un
            « rejeu de session » (via Sentry) sont enregistrés pour diagnostiquer
            l’incident. Le texte, les saisies et les médias sont{" "}
            <strong>masqués</strong> : aucune donnée personnelle n’y figure. L’enregistrement
            ne se déclenche <strong>qu’en cas d’erreur</strong>, jamais en continu.
          </Li>
        </ul>
      </Section>

      <Section title="Pourquoi et sur quelle base légale">
        <ul className="space-y-1">
          <Li>
            Fournir et gérer le service (compte, planning, listes, abonnement) —{" "}
            <em>exécution du contrat</em>.
          </Li>
          <Li>
            Envoyer les e-mails de service (confirmation, réinitialisation de mot de
            passe) — <em>exécution du contrat</em>.
          </Li>
          <Li>
            Sécurité, prévention des abus, diagnostic technique (suivi d’erreurs) et bon
            fonctionnement — <em>intérêt légitime</em>.
          </Li>
          <Li>
            Mesure d’audience et cookies non essentiels — <em>consentement</em>
            (révocable à tout moment).
          </Li>
        </ul>
      </Section>

      <Section title="Sous-traitants et destinataires">
        <p>
          Vos données ne sont jamais vendues. Elles sont traitées par des prestataires
          agissant pour notre compte, sous accord de traitement (DPA) :
        </p>
        <ul className="space-y-1">
          <Li>
            <strong>Supabase</strong> — base de données et authentification.
          </Li>
          <Li>
            <strong>Vercel</strong> — hébergement du site et de l’application.
          </Li>
          <Li>
            <strong>Stripe</strong> — paiement et gestion des abonnements.
          </Li>
          <Li>
            <strong>Brevo</strong> — envoi des e-mails transactionnels.
          </Li>
          <Li>
            <strong>Google</strong> — connexion Google (OAuth) et mesure d’audience
            (Google Analytics, soumise à consentement).
          </Li>
          <Li>
            <strong>Sentry</strong> — suivi des erreurs et diagnostic technique
            (rejeu de session masqué, déclenché uniquement en cas d’erreur).
          </Li>
          <Li>
            <strong>Anthropic</strong> — génération de recettes par intelligence
            artificielle (le contenu que vous envoyez pour générer une recette est
            transmis à ce prestataire à cette seule fin).
          </Li>
        </ul>
      </Section>

      <Section title="Transferts hors Union européenne">
        <p>
          Certains prestataires sont situés en dehors de l’UE (notamment aux États-Unis).
          Ces transferts sont encadrés par des garanties appropriées (clauses
          contractuelles types de la Commission européenne et/ou Data Privacy Framework).
        </p>
      </Section>

      <Section title="Durée de conservation">
        <p>
          Vos données sont conservées tant que votre compte est actif. Après la
          suppression de votre compte, elles sont effacées ou anonymisées sous un délai
          raisonnable, sauf obligation légale de conservation (ex. facturation).
        </p>
      </Section>

      <Section title="Sécurité">
        <p>
          Les échanges sont chiffrés (HTTPS). L’accès aux données de chaque foyer est
          cloisonné au niveau de la base (isolation par foyer). Les mots de passe sont
          chiffrés par notre prestataire d’authentification.
        </p>
      </Section>

      <Section title="Vos droits">
        <p>
          Conformément au RGPD, vous disposez des droits d’accès, de rectification,
          d’effacement, de portabilité, de limitation et d’opposition. Vous pouvez les
          exercer à{" "}
          <a className="underline" href={`mailto:${CONTACT}`}>
            {CONTACT}
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL
          (www.cnil.fr).
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          {APP_NAME} utilise des cookies strictement nécessaires (session et connexion) et,
          <strong> uniquement avec votre consentement</strong>, des cookies de mesure
          d’audience (Google Analytics). Le consentement par défaut est « refusé » ; vous
          pouvez le modifier à tout moment via le bandeau de cookies.
        </p>
      </Section>

      <Section title="Mineurs">
        <p>
          Le service s’adresse à des personnes majeures. Un mineur ne peut créer de compte
          que sous la responsabilité d’un parent ou tuteur.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Responsable des données : Yannick Clément, 33720 Landiras, France —{" "}
          <a className="underline" href={`mailto:${CONTACT}`}>
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
