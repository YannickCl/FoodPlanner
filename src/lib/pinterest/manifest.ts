// Manifeste des épingles Pinterest — source unique de vérité.
// Sert à la fois à générer les visuels (scripts/generate-pins.mts) et à publier
// via l'API (src/lib/pinterest/publish.ts). Fichier volontairement SANS import
// (data pure) pour être utilisable côté script Node comme côté app Next.
//
// Ajouter une épingle = ajouter une entrée ici, régénérer les visuels
// (`npx tsx scripts/generate-pins.mts`), commiter, puis laisser le cron publier.

export type PinSpec = {
  /** Identifiant court : nom du PNG (public/pins/<slug>.png) et clé interne. */
  slug: string;
  /** Nom EXACT du tableau Pinterest de destination (insensible à la casse). */
  board: string;
  /** Chemin de la page de destination (concaténé à SITE_URL). */
  path: string;
  /** Titre de l'épingle — UNIQUE : sert aussi de clé de déduplication anti-doublon. */
  pinTitle: string;
  /** Description SEO de l'épingle. */
  description: string;

  // --- Habillage du visuel ---
  accent: string;
  soft: string;
  emoji: string;
  kicker: string;
  /** Titre affiché sur l'image (peut contenir <br> et entités HTML). */
  titleHtml: string;
  /** Sous-titre affiché sur l'image. */
  subHtml: string;
  cta: string;
};

export const PIN_MANIFEST: PinSpec[] = [
  {
    slug: "menu-vegetarien-semaine",
    board: "Menus végétariens",
    path: "/guide/menu-vegetarien-semaine",
    pinTitle: "Menu végétarien de la semaine (7 dîners + liste de courses)",
    description:
      "7 idées de dîners végétariens équilibrés pour toute la famille, avec la liste de courses à imprimer. Des repas sans viande simples, économiques et rassasiants. 🌱",
    accent: "#6d9a76",
    soft: "#e2efe2",
    emoji: "🥦",
    kicker: "MENU VÉGÉ",
    titleHtml: "Menu végétarien<br>de la semaine",
    subHtml: "7 dîners équilibrés<br>+ liste de courses à imprimer",
    cta: "Voir le menu",
  },
  {
    slug: "que-manger-ce-soir",
    board: "Que manger ce soir",
    path: "/guide/que-manger-ce-soir",
    pinTitle: "Que manger ce soir ? 30 idées de dîners rapides",
    description:
      "Plus jamais de panne d'inspiration ! 30 idées de repas pour ce soir, classées par situation : pressé·e, vide-frigo, réconfort, léger… Trouvez la vôtre en 10 secondes. ⚡",
    accent: "#c1913f",
    soft: "#f5e9d3",
    emoji: "⚡",
    kicker: "IDÉES DÎNER",
    titleHtml: "Que manger<br>ce soir&nbsp;?",
    subHtml: "30 idées classées par situation&nbsp;:<br>pressé·e, vide-frigo, réconfort…",
    cta: "Trouver une idée",
  },
  {
    slug: "menu-batch-cooking-semaine",
    board: "Batch cooking & meal prep",
    path: "/guide/menu-batch-cooking-semaine",
    pinTitle: "Menu batch cooking d'une semaine (avec liste de courses)",
    description:
      "Préparez 7 dîners pour la famille en une seule session de 2h30. Le menu complet, le plan de la session et la liste de courses par rayon, à imprimer. 🍲",
    accent: "#62a89e",
    soft: "#e2f1ee",
    emoji: "🍲",
    kicker: "BATCH COOKING",
    titleHtml: "1 session<br>= 7 dîners",
    subHtml: "Cuisinez toute la semaine<br>en une seule fois",
    cta: "Le menu complet",
  },
  {
    slug: "menu-semaine-pas-cher",
    board: "Repas pas chers",
    path: "/guide/menu-semaine-pas-cher",
    pinTitle: "Menu de la semaine pas cher pour la famille",
    description:
      "Bien manger toute la semaine avec un budget maîtrisé : idées de repas économiques, astuces anti-gaspi et liste de courses maligne. 💶",
    accent: "#cf7f5f",
    soft: "#f5e9d3",
    emoji: "💶",
    kicker: "PETIT BUDGET",
    titleHtml: "Menu de la<br>semaine pas cher",
    subHtml: "Bien manger sans se ruiner&nbsp;:<br>menus &amp; astuces anti-gaspi",
    cta: "Voir les idées",
  },
  {
    slug: "menu-semaine-automne",
    board: "Menus de la semaine",
    path: "/guide/menu-semaine-automne",
    pinTitle: "Menu de la semaine d'automne (7 dîners de saison)",
    description:
      "7 dîners de saison pour la famille : courge, champignons, poireaux, légumes racines… Réconfortant, économique, avec la liste de courses à imprimer. 🍂",
    accent: "#cf7f5f",
    soft: "#f5e9d3",
    emoji: "🍂",
    kicker: "MENU D'AUTOMNE",
    titleHtml: "Menu de la<br>semaine d'automne",
    subHtml: "7 dîners de saison<br>+ liste de courses à imprimer",
    cta: "Voir le menu",
  },
  {
    slug: "menu-de-la-semaine",
    board: "Menus de la semaine",
    path: "/guide/menu-de-la-semaine",
    pinTitle: "Comment planifier son menu de la semaine (méthode simple)",
    description:
      "La méthode pas à pas pour organiser une semaine de repas en 15 minutes, alléger la charge mentale et ne plus jamais improviser à 18h. 🗓️",
    accent: "#6f95bd",
    soft: "#e8eff8",
    emoji: "🗓️",
    kicker: "LA MÉTHODE",
    titleHtml: "Le menu<br>de la semaine",
    subHtml: "Planifiez une semaine<br>de repas en 15 minutes",
    cta: "La méthode",
  },
  {
    slug: "semainier-a-imprimer",
    board: "Organisation des repas",
    path: "/guide/semainier-a-imprimer",
    pinTitle: "Semainier de repas à imprimer (gratuit)",
    description:
      "Un planning de repas vierge à imprimer et remplir à la main. Idéal pour organiser la semaine et préparer sa liste de courses. 🖨️",
    accent: "#d08aa6",
    soft: "#f7e6ee",
    emoji: "🖨️",
    kicker: "À IMPRIMER",
    titleHtml: "Semainier<br>à imprimer",
    subHtml: "Le planning repas gratuit,<br>vierge, à remplir à la main",
    cta: "Télécharger",
  },
];
