# Le Garde-manger — planification des repas

Application web familiale (1 foyer, 6 personnes) : base de recettes, planning
des déjeuners/dîners sur calendrier, et liste de courses agrégée par rayon.

Développée d'après `PLAN-DEV-CLAUDE-CODE.md`.

## Stack

- **Next.js 16** (App Router, React 19, Server Actions) + TypeScript
- **Prisma 7** avec driver adapter `@prisma/adapter-pg`
- **PostgreSQL (Supabase)**
- **Tailwind CSS v4** (charte parchemin, polices Fraunces / Inter / IBM Plex Mono)
- **Zod** pour la validation
- Protection d'accès : mot de passe partagé (cookie signé, `src/proxy.ts`)

> Note : le cahier des charges visait Next.js 15 / Prisma 7. `create-next-app`
> installe désormais **Next 16** (compatible App Router) et Prisma 7 impose un
> **driver adapter** (d'où `@prisma/adapter-pg`). Ces deux points sont les seuls
> écarts avec la spec.

## Mise en route

### 1. Variables d'environnement

Copier `.env.example` vers `.env` et renseigner :

```bash
cp .env.example .env
```

- `DATABASE_URL` — connexion **poolée** Supabase (Transaction pooler, port 6543),
  suffixée `?pgbouncer=true&connection_limit=1`. Utilisée par l'app en runtime.
- `DIRECT_URL` — connexion **directe** (port 5432). Utilisée par Prisma pour les
  migrations et le seed.
- `APP_PASSWORD` — mot de passe du foyer.
- `AUTH_SECRET` — secret de signature du cookie (`openssl rand -hex 32`).

Les deux chaînes se récupèrent dans Supabase → *Project Settings → Database →
Connection string (URI)*.

### 2. Base de données + données de départ

```bash
npm install            # (postinstall lance prisma generate)
npm run db:migrate     # crée les tables (première fois : prisma migrate dev)
npm run db:seed        # importe les 87 recettes de prisma/seed-recettes.json
```

Le seed affiche des statistiques de parsing et la liste des ingrédients classés
en rayon « Autres » : une relecture manuelle est prévue (le parsing en texte
libre n'est jamais parfait — chaque ingrédient est éditable dans le formulaire).

### 3. Lancer en local

```bash
npm run dev
```

> **Pas encore de Supabase ?** Pour essayer immédiatement avec une base locale
> jetable : lancer `npx prisma dev` dans un terminal, copier son `DATABASE_URL`
> (port 51214) dans `.env` (sur `DATABASE_URL` **et** `DIRECT_URL`), puis
> `npm run db:push && npm run db:seed`.

## Scripts

| Script | Rôle |
|---|---|
| `npm run dev` | serveur de dev |
| `npm run build` / `start` | build & run production |
| `npm run db:migrate` | migration de dev (`prisma migrate dev`) |
| `npm run db:deploy` | applique les migrations (prod / CI) |
| `npm run db:push` | synchronise le schéma sans migration (dev rapide) |
| `npm run db:seed` | importe les recettes |
| `npm run db:studio` | Prisma Studio |

## Structure

```
prisma/
  schema.prisma          modèle de données (§2 de la spec)
  seed.ts                import + parsing de seed-recettes.json
src/
  lib/
    parse-ingredient.ts  parsing tolérant "900g de blancs de poulet"
    normalize.ts         normalisation + clé d'agrégation
    aisle.ts             mots-clés -> rayon (§4)
    generate.ts          algorithme de génération du planning (§3.2, §8)
    shopping.ts          agrégation de la liste de courses (§3.3)
    dates.ts             helpers calendrier / @db.Date
    auth.ts              cookie de session signé (HMAC)
  app/
    calendrier/          vue mensuelle + génération
    recettes/            liste, détail, formulaire création/édition
    courses/             liste de courses (ticket de caisse)
    actions/             Server Actions (recipes, planning, shopping)
  proxy.ts               protection par mot de passe (ex-middleware)
```

## Déploiement Vercel

1. Importer le repo dans Vercel.
2. Renseigner les 4 variables d'environnement (mêmes valeurs qu'en local).
3. `postinstall` régénère le client Prisma automatiquement.
4. Appliquer les migrations : `npm run db:deploy` (Build Command ou une fois
   manuellement).

## Algorithme de génération (rappel)

- Dîner (SOIR) : jamais de féculent.
- Pas deux fois la même famille de féculent sur deux jours consécutifs.
- Respect de `minGapDays` via un **tirage aléatoire pondéré par le carré du
  retard** (évite qu'une recette à fort espacement ne sorte jamais — cf. §8).
- Saisonnalité : `ETE` (août-sept), `HIVER` (nov-janv), `HIVER_PREF` (tout sauf
  juin-août).
- Deux modes : « compléter les trous » (conserve l'existant) et « tout
  régénérer ».
