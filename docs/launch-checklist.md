# Check-list de mise en ligne — Chillmeals

> Légende : `[ ]` à faire · `[x]` fait · 🔒 **toi seulement** (domaine, paiement,
> légal, comptes) · 🤝 **je peux le faire / t'aider**.
> Ordre = du plus bloquant au moins bloquant.

---

## 0. Ce qui est DÉJÀ fait ✅
- [x] Multi-tenant + Supabase Auth en prod (bascule faite)
- [x] Onboarding, planning, liste de courses, mode cuisine, batch cooking, invitation de membre
- [x] Stripe **testé de bout en bout en mode TEST** (checkout → webhook → PREMIUM → portail)
- [x] **Sécurité : RLS activée** sur toutes les tables (fuite API fermée)
- [x] Socle SEO technique : `sitemap.ts`, `robots.ts`, metadata, JSON-LD (en **mode furtif**)
- [x] Contenu vitrine : 3 piliers, 6 satellites, 3 landing produit, 1 comparatif
- [x] Design pastel + cursive (vitrine ET app harmonisées)

---

## 1. BLOQUANTS avant ouverture au public

### A. Nom & marque — NOM RETENU : **Chillmeals**
- [x] Recherche INPI **exacte** (bases FR/EU/WO, marques en vigueur) : **aucun résultat** → rien ne bloque
- [x] 🤝 `APP_NAME` = "Chillmeals" dans `src/lib/brand.ts` (swap fait partout)
- [x] 🔒 Acheter le **domaine `chillmeals.fr`** (le `.com` est pris par un traiteur US « Chill Meals »)
- [ ] 🔒 Avant dépôt : **recherche approfondie** (CPI, similarités phonétiques) puis **déposer la marque** (classes 9/42/43)

### B. Domaine & infrastructure
> **Décision** : **un seul domaine `chillmeals.fr`** (vitrine + app, tout sur l'apex).
> Registrar = **OVH**. Domaine **acheté** ✅.
- [x] 🔒 OVH → Zone DNS : apex **A** → `216.198.79.1`, **CNAME** `www` → cible Vercel du projet
      (vérifié : résolution + HTTPS OK sur les deux domaines)
- [x] 🔒 Vercel → **Domains** : `chillmeals.fr` (primaire) + `www` → 308 vers l'apex
- [x] 🔒 Vercel → `NEXT_PUBLIC_SITE_URL=https://chillmeals.fr` (vérifié : sitemap en URLs absolues)
- [ ] 🔒 Supabase → **Site URL** + **Redirect URLs** = `https://chillmeals.fr`
      (callbacks auth : `/reset/update`, `/rejoindre`, retour Stripe) — **à confirmer**

### C. Authentification e-mail (actuellement OFF pour le dev)
- [x] 🤝 **Flux signup adapté à Confirm email** : `emailRedirectTo` (invite → `/rejoindre`,
      sinon `/onboarding`) + message « vérifie ta boîte mail » si pas de session.
      Vérifié : aucune régression avec Confirm email OFF (signup → onboarding).
- [x] 🔒 Supabase → **URL Configuration** : Site URL + Redirect URLs `https://chillmeals.fr/**` ✅
- [x] 🔒 **SMTP = Brevo** configuré (domaine authentifié : DKIM brevo1/brevo2 + code + DMARC ;
      SPF inchangé = normal, Brevo aligne via DKIM). **Reset testé : e-mail reçu en boîte de
      réception**, expéditeur `noreply@chillmeals.fr` ✅
- [ ] 🤝 **Franciser les templates e-mail** (Confirm signup + Reset) — prêts dans
      `docs/email-templates.md`, à coller dans Supabase → Auth → Email Templates
- [ ] 🔒 Supabase → **réactiver « Confirm email »** (le fix signup est déjà en place)
- [ ] 🤝 Tester **inscription avec confirmation** de bout en bout (reset déjà OK)
- [x] 🤝 **Connexion Google (OAuth)** live : bouton + route `/auth/callback` (routage
      onboarding/app/invitation). **Vérifié en prod** : clic → écran Google OAuth.
- [x] 🔒 Google Cloud (scopes openid/email/profile + client OAuth) + Supabase provider Google
      + `NEXT_PUBLIC_GOOGLE_AUTH=true` sur Vercel ✅
- [x] 🔒 App OAuth **publiée (En production)** + Branding rempli + domaine vérifié en GSC.
      Scopes non sensibles → **aucune validation Google requise** (bandeau « à valider » ignorable).
- [ ] 🤝 Test final Google (🔒, ton vrai compte) : connexion → onboarding/app + cas invitation
- [ ] (cosmétique, optionnel) 1er écran Google affiche `…supabase.co` : pour montrer
      `chillmeals.fr`, il faudrait un **domaine d'auth personnalisé Supabase** (payant) — non requis

### D. Paiement — passer Stripe en LIVE
- [x] 🔒 Créer les **prix live** (**5,99 €/mois**, **60 €/an**, essai 7 j) — récurrents, devise EUR
      (`STRIPE_PRICE_MONTHLY=price_1UAaZ0…dbv1bJrM`, `STRIPE_PRICE_ANNUAL=price_1UAaZF…s4wCzixs`)
- [x] 🔒 Vercel → clés **live** posées + redeploy
- [x] 🔒 Enregistrer le **webhook live** → `https://chillmeals.fr/api/stripe/webhook`
- [~] 🤝 Tunnel live **partiellement vérifié** : session checkout live OK, price ID OK,
      essai 7 j OK, base EUR OK. **Reste à finir** (🔒, carte réelle) : aller au bout d'un
      checkout pendant l'essai → vérifier passage **PREMIUM** + **portail**, puis **annuler**
      pendant l'essai (aucun débit). Webhook non exercé tant qu'un abonnement n'est pas créé.
- [x] 🤝 **Adaptive Pricing désactivé** → tout le monde paie en EUR (choix confirmé)
- [ ] 🔒 **Structure juridique + TVA + compte bancaire** pour encaisser (auto-entrepreneur/société)

### E. Légal (RGPD & responsabilité)
- [ ] 🔒 **CGU + Politique de confidentialité + Mentions légales** rédigées/validées
      par un professionnel (la page `/mentions-legales` est un **placeholder**)
- [x] 🤝 **Disclaimer allergènes** permanent ajouté (fiche recette, sous les ingrédients)
      + déjà présent dans /mentions-legales et à l'onboarding — wording final à valider par le juriste
- [x] 🤝 Bandeau **cookies/consentement** (Consent Mode v2 « denied » par défaut ; « refuser » = « accepter ») — fait

### F. SEO — ouvrir l'indexation (le jour J)
- [ ] 🔒 Vercel → `NEXT_PUBLIC_SEO_INDEX=true` (⚠️ **rebuild**) → ouvre la vitrine,
      garde l'app en `noindex` (déjà vérifié)
- [ ] 🤝 Vérifier en prod `robots.txt` (Allow vitrine / Disallow app) + `sitemap.xml`
- [ ] 🔒 **Google Search Console** : valider le domaine, soumettre le sitemap
- [ ] 🔒 (bonus) **Bing Webmaster Tools**

---

## 2. Sécurité & données
- [x] **Audit d'isolation multi-foyers** (queries + actions + API) ✅
- [x] RLS activée sur toutes les tables ✅
- [x] Droits API `public` **révoqués** pour `anon`/`authenticated` (tables/séquences/défaut) → API REST publique = 401 ✅
- [x] `/api/push/test` sécurisé (auth + scope foyer) ✅
- [x] `setMeal` vérifie l'appartenance de la recette ✅
- [x] En-têtes de sécurité (X-Frame-Options, nosniff, HSTS, Referrer-Policy, Permissions-Policy) ✅
- [x] 🤝 **CSP (Content-Security-Policy)** posée dans `next.config.ts` (GTM/GA + Supabase https/wss
      + 'self' ; object-src none, frame-ancestors self, upgrade-insecure-requests ; prod sans
      'unsafe-eval') — **vérifiée sans violation** : vitrine, login, app, réglages ✅
- [ ] 🔒 Supprimer les **comptes auth de test** dans Supabase :
      `testphase01@example.com`, `stripe-prod-test@example.com`, `yannickclement01+diag…`,
      `stripe-live-check@example.com` + `invite-test@example.com` + `confirm-fix-test@example.com`
      + `confirm-email-test@example.com` (non confirmé) (+ leur foyer « Test Stripe Live » —
      créés pour vérifier tunnel Stripe live, invitation, signup et Confirm email le 2026-08-31,
      aucun paiement effectué)
      (leurs lignes applicatives sont déjà nettoyées)
- [x] Foyer fondateur intact (94 recettes, 1 membre) ✅
- [x] 🤝 **GTM + GA4** live avec **Consent Mode v2** + **bandeau cookies** RGPD/CNIL ✅
      `NEXT_PUBLIC_GTM_ID=GTM-5MW8CHQ9` posé sur Vercel ; balise **Google G-48H5WKJZQX** publiée
      dans GTM ; vérifié en prod (conteneur chargé, consentement denied par défaut)

---

## 3. Mesure & suivi
- [x] 🤝 **Analytics = GTM + GA4** live et vérifié (cf. section 2) ✅
- [ ] 🔒 Vérifier que **cron-job.org** (rappels push) pointe le bon domaine
- [ ] 🤝 (bonus) Suivi d'erreurs (Sentry)

---

## 4. Vérifs finales avant annonce
- [x] 🤝 Parcours prod partiel : signup → onboarding → app **vérifié** (compte de test) ;
      reste l'**upgrade Stripe live** (🔒, carte réelle)
- [x] 🤝 **Invitation d'un membre** via lien de partage — **testé OK en prod** (lien → page
      d'invitation au bon foyer → inscription `/signup?invite=` → rattachement même foyer,
      rôles Propriétaire/Membre corrects). Bug « unexpected response » confirmé corrigé.
- [x] 🤝 **Mobile / PWA** vérifié : manifeste valide, icônes 200 (192/512 any+maskable,
      apple-touch, favicon), rendu responsive OK — **1 bug corrigé** (header vitrine qui
      débordait à 375 px)
- [x] 🤝 **Audit SEO/contenu** vitrine : titres uniques, meta-descriptions, canonical absolus,
      1 H1/page, JSON-LD, **aucun reste « Food Planner »** ; console **sans erreur** (Lighthouse
      complet possible plus tard si besoin)
- [x] 🤝 Vitrine relue avec le **nom final** (logo, `<title>`, manifeste) ✅

---

## 5. Post-lancement
- [ ] Valider auprès de **quelques familles réelles** avant grosse dépense marketing
- [ ] Poursuivre le **contenu SEO** (satellites batch, autres comparatifs)
- [ ] **Product Hunt FR / presse « charge mentale »** (backlinks + premiers utilisateurs)

---

## Récap des variables d'environnement à (re)poser sur Vercel au lancement
```
NEXT_PUBLIC_SITE_URL=https://<domaine>      # + rebuild
NEXT_PUBLIC_SEO_INDEX=true                  # + rebuild
STRIPE_SECRET_KEY=sk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…               # webhook LIVE
STRIPE_PRICE_MONTHLY=price_…                # prix live mensuel
STRIPE_PRICE_ANNUAL=price_…                 # prix live annuel
# (déjà en place, à laisser) NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY, DATABASE_URL,
# DIRECT_URL, ANTHROPIC_API_KEY, VAPID_*, CRON_SECRET
```
⚠️ Les variables `NEXT_PUBLIC_*` sont lues **au build** : changer leur valeur nécessite un **redeploy**.
