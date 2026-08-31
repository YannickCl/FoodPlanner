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
- [ ] 🔒 Acheter le **domaine `chillmeals.fr`** (le `.com` est pris par un traiteur US « Chill Meals »)
- [ ] 🔒 Avant dépôt : **recherche approfondie** (CPI, similarités phonétiques) puis **déposer la marque** (classes 9/42/43)

### B. Domaine & infrastructure
> **Décision** : **un seul domaine `chillmeals.fr`** (vitrine + app, tout sur l'apex).
> Registrar = **OVH**. Domaine **acheté** ✅.
- [ ] 🔒 OVH → Zone DNS : apex **A** → `76.76.21.21` (supprimer l'AAAA existant),
      **CNAME** `www` → `cname.vercel-dns.com.`
- [ ] 🔒 Vercel → **Domains** : ajouter `chillmeals.fr` + `www.chillmeals.fr` (HTTPS auto)
- [ ] 🔒 Vercel → variable `NEXT_PUBLIC_SITE_URL=https://chillmeals.fr` (⚠️ **rebuild** requis)
- [ ] 🔒 Supabase → **Site URL** + **Redirect URLs** = domaine prod
      (callbacks auth : `/reset/update`, `/rejoindre`, retour Stripe)

### C. Authentification e-mail (actuellement OFF pour le dev)
- [ ] 🔒 Supabase → **réactiver « Confirm email »**
- [ ] 🔒 Supabase → configurer un **SMTP** (sinon délivrabilité faible + rate limit
      sur les e-mails d'inscription et de réinitialisation)
- [ ] 🤝 Tester **inscription + reset mot de passe** de bout en bout

### D. Paiement — passer Stripe en LIVE
- [ ] 🔒 Créer les **prix live** (3,99 €/mois, 29,99 €/an, essai 7 j)
- [ ] 🔒 Vercel → clés **live** : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
      `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`
- [ ] 🔒 Enregistrer le **webhook live** → `https://<domaine>/api/stripe/webhook`
- [ ] 🤝 Vérifier le tunnel complet en live (checkout → webhook → PREMIUM → portail)
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
- [ ] 🤝 **CSP (Content-Security-Policy)** — à poser au lancement, une fois GTM/GA4 branchés
      (doit lister googletagmanager.com / google-analytics.com + Supabase + 'self')
- [ ] 🔒 Supprimer les **comptes auth de test** dans Supabase :
      `testphase01@example.com`, `stripe-prod-test@example.com`, `yannickclement01+diag…`
      (leurs lignes applicatives sont déjà nettoyées)
- [x] Foyer fondateur intact (94 recettes, 1 membre) ✅
- [x] 🤝 **GTM + GA4** avec **Consent Mode v2** + **bandeau cookies** RGPD/CNIL — **code prêt & vérifié** ;
      conteneur créé, **ID = `GTM-5MW8CHQ9`** → reste 🔒 : poser `NEXT_PUBLIC_GTM_ID=GTM-5MW8CHQ9`
      sur Vercel (Production) + **redeploy** ; vérifier la propriété GA4 dans GTM

---

## 3. Mesure & suivi
- [x] 🤝 **Analytics = GTM + GA4** (code prêt, cf. section 2) — reste 🔒 : créer le conteneur GTM
      + la propriété GA4, puis poser `NEXT_PUBLIC_GTM_ID` sur Vercel
- [ ] 🔒 Vérifier que **cron-job.org** (rappels push) pointe le bon domaine
- [ ] 🤝 (bonus) Suivi d'erreurs (Sentry)

---

## 4. Vérifs finales avant annonce
- [ ] 🤝 Parcours complet en prod : signup (+ confirm email) → onboarding → planning →
      liste → cuisine → batch → **upgrade Stripe live**
- [ ] 🤝 **Invitation d'un membre** via lien de partage (corrigé récemment)
- [ ] 🤝 Test **mobile / PWA** (ajout à l'écran d'accueil), icônes au **nouveau nom**
- [ ] 🤝 **Lighthouse** (perf / SEO / accessibilité) sur la vitrine
- [ ] 🤝 Relire la vitrine avec le **nom final** (logo, `<title>`, manifeste)

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
