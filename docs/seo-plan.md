# Plan SEO — Food Planner (futur *Tablée* / *Menoo*)

> La vitrine est le canal d'acquisition n°1 au lancement. Ce plan vise le
> référencement organique français, sur le créneau *planning de repas /
> batch cooking / charge mentale*.

## 0. Principe directeur

Le **nom de domaine ne fait pas le SEO** — c'est le **contenu** qui range.
Objectif : devenir l'**autorité thématique** française sur trois piliers :

1. **Batch cooking** ← notre différenciateur, concurrence encore faible = *quick win*
2. **Menu / planning de la semaine** ← gros volume, cœur du produit
3. **Charge mentale / organisation des repas** ← angle émotionnel, conversion

On gagne en publiant des **guides réellement utiles** (pas du contenu IA en
masse — Google pénalise le *thin/AI content* via le *Helpful Content System*, et
ça contredit notre positionnement honnête).

---

## 1. Univers de mots-clés (clusters)

> Volumes = estimation qualitative (à valider dans Google Search Console +
> Keyword Planner une fois le domaine indexé). Priorité = volume × intention ÷ concurrence.

### Cluster A — Batch cooking (PRIORITÉ 1 : concurrence faible + différenciateur)
| Requête | Intention | Volume | Concurrence | Prio |
|---|---|---|---|---|
| batch cooking | Info | Fort | Moyenne | ⭐⭐⭐ |
| batch cooking débutant / comment faire | Info | Moyen | Faible | ⭐⭐⭐ |
| menu batch cooking semaine | Info/Trans | Moyen | Faible | ⭐⭐⭐ |
| batch cooking recettes | Info | Moyen | Moyenne | ⭐⭐ |
| batch cooking hiver / été | Info saisonnier | Moyen | Faible | ⭐⭐⭐ |
| matériel / organisation batch cooking | Info | Faible | Faible | ⭐⭐ |
| application batch cooking | Trans (BOFU) | Faible | Faible | ⭐⭐⭐ |

### Cluster B — Menu / planning de la semaine (PRIORITÉ 1 : cœur produit)
| Requête | Intention | Volume | Concurrence | Prio |
|---|---|---|---|---|
| menu de la semaine (famille / équilibré) | Info/Trans | Fort | Forte | ⭐⭐ |
| planning repas semaine | Info/Trans | Fort | Moyenne | ⭐⭐⭐ |
| semainier repas à imprimer | Trans (aimant) | Moyen | Moyenne | ⭐⭐⭐ |
| planificateur de repas / application | Trans (BOFU) | Moyen | Moyenne | ⭐⭐⭐ |
| organiser ses repas de la semaine | Info | Moyen | Faible | ⭐⭐⭐ |
| idées repas semaine / rapides | Info | Fort | Forte | ⭐ |

### Cluster C — Charge mentale / « on mange quoi » (angle émotionnel)
| Requête | Intention | Volume | Concurrence | Prio |
|---|---|---|---|---|
| on mange quoi ce soir / que manger ce soir | Info | Très fort | Forte | ⭐⭐ |
| charge mentale repas / cuisine | Info | Moyen | Faible | ⭐⭐⭐ |
| quoi manger cette semaine | Info | Moyen | Moyenne | ⭐⭐ |

### Cluster D — Liste de courses (fonctionnalité)
| Requête | Intention | Volume | Concurrence | Prio |
|---|---|---|---|---|
| liste de courses type / semaine | Trans (aimant) | Fort | Forte | ⭐⭐ |
| application liste de courses (famille) | Trans (BOFU) | Moyen | Moyenne | ⭐⭐⭐ |
| liste de courses automatique | Trans | Faible | Faible | ⭐⭐⭐ |

### Cluster E — Comparatifs / alternatives (BOFU : forte conversion)
| Requête | Intention | Volume | Concurrence | Prio |
|---|---|---|---|---|
| meilleure application repas / menu | Trans | Moyen | Moyenne | ⭐⭐⭐ |
| jow avis / jow alternative | Trans | Moyen | Faible | ⭐⭐⭐ |
| application menu semaine famille | Trans | Faible | Faible | ⭐⭐⭐ |

### Cluster F — Contraintes / régimes (longue traîne, bonne conversion)
menu semaine équilibré / budget / pas cher / végétarien / sans lactose /
enfants — chacun = 1 article, très ciblé, faible concurrence.

---

## 2. Stratégie de contenu — *topic clusters* (pilier + satellites)

Modèle **hub-and-spoke** : 1 page **pilier** longue et exhaustive par thème,
qui maille vers des **articles satellites** ciblant la longue traîne, qui
remaillent vers le pilier. C'est ce qui construit l'autorité thématique.

- **Pilier 1** `/guide/batch-cooking` — « Le guide complet du batch cooking »
  - satellites : débutant, menu batch semaine, recettes batch, batch hiver/été,
    matériel, conservation (frigo/congélo), erreurs de débutant
- **Pilier 2** `/guide/menu-semaine` — « Organiser le menu de la semaine »
  - satellites : semainier à imprimer, menu équilibré, menu budget, menu enfants,
    menu végétarien
- **Pilier 3** `/guide/charge-mentale-repas` — « En finir avec le on-mange-quoi »
  - satellites : idées repas rapides, quoi manger cette semaine, routine repas

Chaque pilier finit par un **CTA vers l'inscription** (essai 7 jours).

---

## 3. Architecture du site

### Pages « produit » (transactionnelles — elles rankent AUSSI sur des mots-clés)
Transformer les fonctionnalités en **landing pages dédiées**, chacune ciblant une requête :
- `/` — home : cible « planning repas famille » / « menu de la semaine »
- `/planning-repas` — cible « planificateur de repas / application planning repas »
- `/liste-de-courses` — cible « application liste de courses automatique »
- `/batch-cooking` — cible « application batch cooking » (+ maille vers le pilier /guide)
- `/mode-cuisine` — cible « mode cuisine / minuteurs recette »
- `/tarifs` — existant
- `/comparatif/jow` (et autres) — pages BOFU « [concurrent] alternative / avis »

### Contenu (informationnel)
- `/guide/*` (les 3 piliers + satellites) — le moteur de trafic

### Aimants à trafic (lead magnets, très partagés = backlinks)
- semainier vierge **à imprimer** (PDF)
- liste de courses type **à imprimer** (PDF)
- 1 menu batch cooking d'exemple (PDF)
→ pages qui rankent sur « … à imprimer » et récoltent des liens.

---

## 4. Modèles on-page (title / meta / H1)

Règles : mot-clé principal en tête du `<title>`, marque à la fin ; `<h1>` unique
proche du title ; meta description ~150 car. avec bénéfice + CTA implicite.

- **Home** `<title>` : `Planning des repas de la famille & liste de courses — {MARQUE}`
- **Feature** : `Application de planning de repas — {MARQUE}`
- **Pilier** : `Batch cooking : le guide complet pour débuter (2026) — {MARQUE}`
- **Satellite** : `Menu batch cooking d'une semaine (avec liste de courses) — {MARQUE}`
- **Comparatif** : `Alternative à Jow : {MARQUE}, sans pub ni supermarché imposé`

Bonnes pratiques transverses :
- 1 seul H1, hiérarchie H2/H3 propre
- URLs courtes, en-slugs mots-clés, sans accent (`/batch-cooking`)
- Maillage interne systématique pilier ↔ satellites ↔ pages produit
- Images en `next/image`, `alt` descriptifs, `og:image` par page

---

## 5. SEO technique — checklist (implémentable maintenant)

- [ ] **Lever le verrou `robots: {index:false}`** de `layout.tsx` au lancement.
      → Mettre l'app (`/calendrier`, `/recettes`, `/reglages`, `/onboarding`, `/batch`…)
      en **noindex par route**, et la **vitrine en index**. (Aujourd'hui tout est bloqué.)
- [ ] `src/app/sitemap.ts` (Next génère `/sitemap.xml`) listant vitrine + /guide.
- [ ] `src/app/robots.ts` → autorise la vitrine, `Disallow` l'app, pointe le sitemap.
- [ ] `metadataBase` + `openGraph` + `twitter` par défaut dans le layout racine.
- [ ] `export const metadata` sur **chaque** page vitrine (title/description/canonical/OG).
- [ ] Rendu **statique** des pages vitrine/blog (`generateStaticParams`, pas de `force-dynamic`).
- [ ] Core Web Vitals : polices déjà locales (Fraunces/Inter via next/font ✅),
      images optimisées, pas de layout shift ; viser LCP < 2,5 s.
- [ ] Mobile-first (PWA déjà en place ✅), `lang="fr"` (déjà ✅).
- [ ] Domaine unique canonique (www vs non-www), HTTPS (Vercel ✅).
- [ ] Brancher le domaine final + définir Supabase Site URL au lancement.

---

## 6. Données structurées (schema.org / JSON-LD)

Balisage = **rich results** dans Google (meilleur CTR) :
- **Home** : `SoftwareApplication` (+ `AggregateRating` quand on aura des avis)
- **Piliers/satellites** : `Article` (auteur, date, image)
- **Pages avec FAQ** : `FAQPage` → obtient les accordéons dans la SERP
- **Menus d'exemple** : `Recipe` (temps, ingrédients, étapes) → étoiles + temps affichés
- Global : `Organization` + `BreadcrumbList`

⚠️ Ne PAS générer en masse des pages recettes IA pour le SEO (risque *thin/AI
content*). Le balisage `Recipe` se réserve aux menus d'exemple éditorialisés.

---

## 7. Calendrier éditorial — 90 jours

**Mois 1 — Fondations + Batch cooking (concurrence faible = on rank vite)**
- Semaine 1 : socle technique (sitemap, robots, metadata, JSON-LD, GSC) + lever noindex vitrine
- Semaine 2 : pilier `/guide/batch-cooking`
- Semaine 3 : satellites batch (débutant, menu batch semaine)
- Semaine 4 : satellites batch (hiver/été, matériel) + aimant PDF « menu batch »

**Mois 2 — Menu semaine + pages produit**
- Landing pages `/planning-repas`, `/batch-cooking`, `/liste-de-courses`
- Pilier `/guide/menu-semaine` + satellite « semainier à imprimer » (aimant PDF)
- 1 page comparatif BOFU (`/comparatif/jow`)

**Mois 3 — Charge mentale + longue traîne**
- Pilier `/guide/charge-mentale-repas`
- Satellites régimes (équilibré, budget, enfants, végétarien)
- Refresh + maillage interne + relance des articles mois 1 (mise à jour)

Rythme cible : **1–2 contenus / semaine**, qualité > quantité.

---

## 8. Mesure & outils

- **Google Search Console** (obligatoire) : soumettre le sitemap, suivre requêtes/CTR/positions.
- **Bing Webmaster Tools** (bonus, 2 min).
- **Analytics respectueux RGPD** : **Plausible** ou **Umami** (cohérent avec le
  positionnement « app honnête, sans pub » ; pas de bandeau cookies lourd).
- KPI à suivre : impressions & clics par cluster, positions moyennes sur les
  requêtes cibles, taux inscription vitrine→signup, articles → essai 7 j.
- Backlinks : viser blogs parentalité/cuisine/organisation, annuaires SaaS FR,
  Product Hunt FR, presse « charge mentale ».

---

## 9. Ce qu'on NE fait PAS (pièges)

- ❌ Nom/domaine « mot-clé » exact (EMD) — dévalué + marque faible.
- ❌ Pages recettes IA en masse — *thin content*, risque de pénalité.
- ❌ Bourrage de mots-clés — écrire pour l'humain d'abord.
- ❌ Laisser l'app indexable (pages privées, duplication).
- ❌ Négliger la vitesse mobile — c'est un facteur de ranking.
