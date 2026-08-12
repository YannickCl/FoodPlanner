import { Aisle } from "@/generated/prisma/enums";
import { stripAccents } from "./normalize";

// Mapping mots-clés -> rayon (PLAN-DEV-CLAUDE-CODE.md §4).
// Testé sur le nom normalisé (minuscules, sans accents). Premier rayon qui
// matche l'emporte ; ordre = priorité (protéines avant légumes pour éviter
// qu'un plat "poulet aux tomates" tombe en fruits & légumes).
const AISLE_KEYWORDS: { aisle: Aisle; keywords: string[] }[] = [
  {
    aisle: Aisle.BOUCHERIE,
    keywords: [
      "boeuf", "veau", "porc", "poulet", "dinde", "lardons", "lardon",
      "jambon", "saucisse", "chorizo", "confit", "canard", "viande",
      "agneau", "merguez", "steak", "escalope", "guanciale", "poitrine fumee",
    ],
  },
  {
    aisle: Aisle.POISSONNERIE,
    keywords: [
      "saumon", "cabillaud", "thon", "crevette", "moule", "poisson",
      "dorade", "colin", "lieu", "gambas", "calamar", "sardine", "maquereau",
    ],
  },
  {
    aisle: Aisle.CREMERIE,
    keywords: [
      "creme", "lait", "beurre", "fromage", "gruyere", "parmesan", "feta",
      "mozzarella", "reblochon", "oeuf", "yaourt", "ricotta", "chevre",
      "comte", "emmental", "cheddar", "mascarpone",
    ],
  },
  {
    aisle: Aisle.FRUITS_LEGUMES,
    keywords: [
      "tomate", "oignon", "poivron", "courgette", "carotte", "salade",
      "persil", "menthe", "concombre", "potiron", "chou", "aubergine",
      "ail", "echalote", "citron", "pomme de terre", "brocoli", "epinard",
      "champignon", "courge", "poireau", "haricot vert", "avocat", "banane",
      "pomme", "coriandre", "basilic", "gingembre", "celeri", "navet",
      "betterave", "radis", "fenouil", "endive", "legume", "roquette",
      "grenade", "mache", "cresson",
    ],
  },
  {
    aisle: Aisle.EPICERIE,
    keywords: [
      "pate", "riz", "semoule", "quinoa", "farine", "lasagne", "pain",
      "tortilla", "lentille", "haricot", "mais", "levure", "sucre", "sel",
      "poivre", "huile", "vinaigre", "moutarde", "ketchup", "mayo",
      "concentre de tomate", "tomates concassees", "tomate concassee",
      "bouillon", "epice", "curry", "cumin", "paprika", "coco", "boulgour",
      "couscous", "polenta", "gnocchi", "pate brisee", "pate feuilletee",
      "spaghetti", "tagliatelle", "penne", "macaroni", "nouille", "ravioli",
      "olive", "pesto", "cassonade", "sucre", "cornichon", "raisins secs",
      "petits pois", "petit pois", "pois chiche", "sauce soja", "soja",
      "miel", "sesame", "chapelure", "abricot sec", "amande", "pignon",
      "herbe", "thym", "romarin", "origan", "ciboulette", "muscade",
      "bouquet garni", "sauce", "sirop", "chocolat",
    ],
  },
];

/** Déduit le rayon d'un ingrédient à partir de son nom (mots-clés). */
export function guessAisle(name: string): Aisle {
  const n = stripAccents(name);
  for (const { aisle, keywords } of AISLE_KEYWORDS) {
    if (keywords.some((k) => n.includes(k))) return aisle;
  }
  return Aisle.AUTRES;
}
