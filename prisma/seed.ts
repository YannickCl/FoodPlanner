import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  Aisle,
  Category,
  DayType,
  MealTime,
  Season,
  StarchFamily,
} from "../src/generated/prisma/enums";
import { parseIngredient } from "../src/lib/parse-ingredient";
import { guessAisle } from "../src/lib/aisle";

// Le seed utilise la connexion DIRECTE (DIRECT_URL) — le pooler ne gère pas
// bien les insertions en masse.
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

interface SeedRecipe {
  nom: string;
  cat: string;
  meal: string;
  day_type: string;
  season: string;
  min_gap: number;
  temps: string;
  ingredients: string[];
  etapes: string[];
  feculent: boolean;
  famille?: string | null;
}

/** Uppercase + validation contre un enum Prisma. Lève si valeur inconnue. */
function toEnum<T extends Record<string, string>>(
  enumObj: T,
  raw: string,
  field: string,
): T[keyof T] {
  const key = raw.toUpperCase();
  if (key in enumObj) return enumObj[key as keyof T];
  throw new Error(`Valeur "${raw}" invalide pour ${field}`);
}

async function main() {
  const path = join(__dirname, "seed-recettes.json");
  const data = JSON.parse(readFileSync(path, "utf-8")) as Record<
    string,
    SeedRecipe
  >;
  const entries = Object.entries(data);
  console.log(`📖 ${entries.length} recettes à importer.\n`);

  // Reset propre : les repas planifiés passent recipeId=null (onDelete: SetNull).
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();

  // Multi-foyers : rattacher les recettes du seed à un foyer (réutilise le premier).
  const household =
    (await prisma.household.findFirst({ orderBy: { createdAt: "asc" } })) ??
    (await prisma.household.create({
      data: { name: "Foyer fondateur", plan: "PREMIUM" },
    }));

  const stats = {
    ingredients: 0,
    withQty: 0,
    withUnit: 0,
    aisleAutres: 0,
  };
  const needReview: string[] = [];

  for (const [slug, r] of entries) {
    const ingredients = r.ingredients.map((line) => {
      const p = parseIngredient(line);
      const aisle = guessAisle(p.name);
      stats.ingredients++;
      if (p.quantity !== null) stats.withQty++;
      if (p.unit !== null) stats.withUnit++;
      if (aisle === Aisle.AUTRES) {
        stats.aisleAutres++;
        needReview.push(`  [${r.nom}] "${line}" -> rayon AUTRES`);
      }
      // "Garnitures au choix (a, b, c)" -> ingrédient à choisir au moment de planifier.
      const isChoice = /garnitur/i.test(p.name) && !!p.note && p.note.includes(",");
      const choiceOptions = isChoice
        ? p.note!.split(",").map((o) => o.trim()).filter(Boolean)
        : [];
      return {
        name: isChoice ? "Garniture au choix" : p.name,
        quantity: isChoice ? null : p.quantity,
        unit: isChoice ? null : p.unit,
        note: isChoice ? null : p.note,
        aisle,
        raw: p.raw,
        isChoice,
        choiceOptions,
      };
    });

    await prisma.recipe.create({
      data: {
        householdId: household.id,
        name: r.nom,
        category: toEnum(Category, r.cat, `${slug}.cat`),
        prepTime: r.temps,
        containsStarch: r.feculent,
        starchFamily: r.famille
          ? toEnum(StarchFamily, r.famille, `${slug}.famille`)
          : null,
        season: toEnum(Season, r.season, `${slug}.season`),
        mealTime: toEnum(MealTime, r.meal, `${slug}.meal`),
        dayType: toEnum(DayType, r.day_type, `${slug}.day_type`),
        minGapDays: r.min_gap,
        servingsBase: 6,
        steps: r.etapes,
        ingredients: { create: ingredients },
      },
    });
  }

  console.log("✅ Import terminé.\n");
  console.log("📊 Qualité du parsing des ingrédients :");
  console.log(`   total          : ${stats.ingredients}`);
  console.log(`   avec quantité  : ${stats.withQty}`);
  console.log(`   avec unité     : ${stats.withUnit}`);
  console.log(`   rayon = AUTRES : ${stats.aisleAutres} (à vérifier)\n`);
  if (needReview.length) {
    console.log("🔎 Lignes classées en AUTRES (relecture conseillée) :");
    console.log(needReview.slice(0, 40).join("\n"));
    if (needReview.length > 40)
      console.log(`   ... et ${needReview.length - 40} autres`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed échoué :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
