import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  Category,
  DayType,
  MealTime,
  Season,
  StarchFamily,
  Unit,
} from "@/generated/prisma/enums";

// IA de génération de recettes via Claude (Anthropic).
// Sortie structurée (JSON Schema), effort "low", streaming. Deux modèles selon
// le besoin (voir ci-dessous).

// Recette unique (depuis un nom / régénération) : Opus 5 pour la qualité
// (~14 s, sous le timeout).
const MODEL_SINGLE = "claude-opus-5";
// Batch « Propose-moi » (5 recettes) : Sonnet 5 — 2-3× plus rapide et ~5× moins
// cher, pour garder une marge confortable sous le timeout de fonction (60 s).
const MODEL_BATCH = "claude-sonnet-5";

export interface AIIngredient {
  name: string;
  quantity: number | null;
  unit: Unit | null;
  note: string | null;
}

export interface AIRecipe {
  name: string;
  category: Category;
  prepTime: string;
  containsStarch: boolean;
  starchFamily: StarchFamily | null;
  season: Season;
  mealTime: MealTime;
  dayType: DayType;
  minGapDays: number;
  ingredients: AIIngredient[];
  steps: string[];
}

const values = <T extends Record<string, string>>(e: T) => Object.values(e);

type JsonSchema = Record<string, unknown>;

const nullable = (schema: JsonSchema): JsonSchema => ({
  anyOf: [schema, { type: "null" }],
});

const INGREDIENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    quantity: nullable({ type: "number" }),
    unit: nullable({ enum: values(Unit) }),
    note: nullable({ type: "string" }),
  },
  required: ["name", "quantity", "unit", "note"],
};

function recipeSchema(withName: boolean): JsonSchema {
  const properties: Record<string, unknown> = {
    ...(withName ? { name: { type: "string" } } : {}),
    category: { enum: values(Category) },
    prepTime: { type: "string" },
    containsStarch: { type: "boolean" },
    starchFamily: nullable({ enum: values(StarchFamily) }),
    season: { enum: values(Season) },
    mealTime: { enum: values(MealTime) },
    dayType: { enum: values(DayType) },
    minGapDays: { type: "integer" },
    ingredients: { type: "array", items: INGREDIENT_SCHEMA },
    steps: { type: "array", items: { type: "string" } },
  };
  return {
    type: "object",
    additionalProperties: false,
    properties,
    required: Object.keys(properties),
  };
}

const SYSTEM = `Tu es un chef qui crée des recettes familiales françaises simples, pour 6 personnes.
Règles de remplissage des champs :
- category : FAVORI (plat plaisir), RAPIDE (<30 min), HEALTHY (léger/équilibré), SALADE_ETE, SOUPE_HIVER.
- containsStarch : true si le plat contient un féculent en quantité (pâtes, riz, pommes de terre, pain, semoule, quinoa…). Un plat avec féculent est réservé au déjeuner.
- starchFamily : obligatoire si containsStarch=true, sinon null. Valeurs : PATES, RIZ, PDT, PAIN, PIZZA, TORTILLA, SEMOULE, QUINOA, GALETTE, PATE_BRISEE.
- season : ALL (toute l'année), ETE (salades froides d'été), HIVER (soupes/plats d'hiver), HIVER_PREF (plats mijotés plutôt l'hiver).
- mealTime : MIDI, SOIR ou BOTH. Un plat avec féculent ne doit pas être SOIR seul.
- dayType : SEMAINE, WEEKEND ou BOTH.
- minGapDays : espacement minimum avant de refaire le plat (14 par défaut, 21-28 pour les plats spéciaux).
- prepTime : texte court, ex "30 min", "1h10".
- ingredients : quantités pour 6 personnes. quantity = nombre (null si "au goût"). unit : G, KG, ML, CL, L, PIECE (pour un décompte : 2 oignons -> quantity 2, unit PIECE), CAS (cuillère à soupe), CAC (cuillère à café), PINCEE. note : précision libre ou null.
- Liste chaque ingrédient sous sa forme ACHETABLE et crue (ex. "riz" cru, pas "riz cuit refroidi" ; "pâtes" crues) : sa cuisson/préparation est décrite dans les étapes.
- N'ajoute PAS le sel, le poivre, l'eau ni l'huile dans la liste (ingrédients de base toujours présents).
- steps : la recette doit être COMPLÈTE et réalisable par un débutant, en partant de zéro. Impérativement :
  • Aucun ingrédient ne doit "apparaître" déjà cuit/préparé sans une étape qui le prépare avant. Ex. pour un riz cantonais : commencer par cuire le riz à l'eau bouillante puis le laisser refroidir — ne suppose JAMAIS un composant déjà prêt.
  • Chaque étape de cuisson précise l'USTENSILE et le feu (ex. "dans une grande poêle ou un wok, à feu vif", "dans une casserole d'eau bouillante", "au four à 200 °C") + une durée ou un repère visuel ("jusqu'à ce que ce soit doré").
  • Explique en quelques mots les gestes techniques (ex. "émincer = couper en fines lamelles").
  • Une action principale par étape, dans l'ordre chronologique.
Réponds uniquement via le format structuré demandé, en français.`;

function client() {
  return new Anthropic(); // lit ANTHROPIC_API_KEY depuis l'environnement
}

function restrictionLine(allergies: string[], forbidden: string[]): string {
  const banned = [...allergies, ...forbidden].filter(Boolean);
  if (!banned.length) return "";
  return `\n\nIMPORTANT : n'utilise JAMAIS ces ingrédients (allergies / aliments interdits du foyer) : ${banned.join(", ")}.`;
}

async function callStructured(
  userText: string,
  schema: JsonSchema,
  maxTokens: number,
  model: string,
): Promise<unknown> {
  // Un seul appel : on streame (évite le timeout de lecture HTTP du SDK sur les
  // générations longues), puis on contrôle l'arrêt et le JSON.
  const once = async (): Promise<unknown> => {
    const res = await client()
      .messages.stream({
        model,
        max_tokens: maxTokens,
        output_config: { effort: "low", format: { type: "json_schema", schema } },
        messages: [{ role: "user", content: userText }],
        system: SYSTEM,
      })
      .finalMessage();

    if (res.stop_reason === "refusal") {
      throw new Error("La génération a été refusée par l'IA.");
    }
    if (res.stop_reason === "max_tokens") {
      // JSON forcément tronqué : inutile de tenter de le parser.
      throw new Error("Réponse IA tronquée (limite de tokens atteinte).");
    }
    const textBlock = res.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Réponse IA vide");
    }
    try {
      return JSON.parse(textBlock.text);
    } catch {
      throw new Error("Réponse IA mal formée (JSON invalide).");
    }
  };

  // Un seul nouvel essai : couvre les aléas transitoires (surcharge API,
  // troncature/JSON ponctuels) sans doubler systématiquement le coût.
  try {
    return await once();
  } catch {
    return await once();
  }
}

/** Génère une recette complète à partir de son nom. */
export async function generateRecipeFromName(
  name: string,
  opts: { allergies?: string[]; forbidden?: string[] } = {},
): Promise<AIRecipe> {
  const prompt =
    `Crée la recette complète pour : "${name}".` +
    restrictionLine(opts.allergies ?? [], opts.forbidden ?? []);
  const data = (await callStructured(
    prompt,
    recipeSchema(false),
    8000,
    MODEL_SINGLE,
  )) as Omit<AIRecipe, "name">;
  return { ...data, name };
}

/** Propose `count` nouvelles recettes complètes (pour l'écran "Propose-moi..."). */
export async function proposeRecipes(opts: {
  count?: number;
  allergies?: string[];
  forbidden?: string[];
  existingNames?: string[];
  type?: Category;
}): Promise<AIRecipe[]> {
  const count = opts.count ?? 5;
  const avoid = opts.existingNames?.length
    ? `\n\nÉvite de proposer des recettes déjà présentes : ${opts.existingNames.slice(0, 120).join(", ")}.`
    : "";
  const typeLine = opts.type
    ? `\n\nToutes les recettes proposées doivent être de la catégorie ${opts.type}.`
    : "";
  const prompt =
    `Propose ${count} nouvelles idées de recettes familiales variées (équilibre entre viande, poisson, végétarien ; midis et soirs). Donne chaque recette complète.` +
    restrictionLine(opts.allergies ?? [], opts.forbidden ?? []) +
    typeLine +
    avoid;

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: { recipes: { type: "array", items: recipeSchema(true) } },
    required: ["recipes"],
  };
  const data = (await callStructured(prompt, schema, 24000, MODEL_BATCH)) as {
    recipes: AIRecipe[];
  };
  return data.recipes ?? [];
}
