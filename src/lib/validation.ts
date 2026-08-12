import { z } from "zod";
import {
  Aisle,
  Category,
  DayType,
  MealTime,
  Season,
  StarchFamily,
  Unit,
} from "@/generated/prisma/enums";

// Quantité : accepte number, "" -> null, "1,2" -> 1.2
const quantitySchema = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return null;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(",", "."));
    return Number.isNaN(n) ? null : n;
  }
  return v;
}, z.number().positive().nullable());

const optionalStr = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? null : v),
  z.string().trim().nullable(),
);

export const ingredientSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  quantity: quantitySchema,
  unit: z.enum(Unit).nullable().catch(null),
  note: optionalStr,
  aisle: z.enum(Aisle),
  isChoice: z.boolean().default(false),
  choiceOptions: z.array(z.string().trim().min(1)).default([]),
});

export const recipeSchema = z
  .object({
    name: z.string().trim().min(1, "Le nom est requis"),
    category: z.enum(Category),
    prepTime: z.string().trim().min(1, "Le temps est requis"),
    containsStarch: z.boolean(),
    starchFamily: z.enum(StarchFamily).nullable().catch(null),
    season: z.enum(Season),
    mealTime: z.enum(MealTime),
    dayType: z.enum(DayType),
    minGapDays: z.coerce.number().int().min(0).max(365),
    servingsBase: z.coerce.number().int().min(1).max(50),
    steps: z.array(z.string().trim().min(1)),
    ingredients: z.array(ingredientSchema).min(1, "Au moins un ingrédient"),
  })
  .refine((d) => !d.containsStarch || d.starchFamily !== null, {
    message: "Choisir une famille de féculent",
    path: ["starchFamily"],
  });

export type RecipeInput = z.infer<typeof recipeSchema>;
export type IngredientInput = z.infer<typeof ingredientSchema>;

export const setMealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mealTime: z.enum([MealTime.MIDI, MealTime.SOIR]),
  recipeId: z.string().nullable(),
  servings: z.coerce.number().int().min(1).max(50).default(6),
  // garnitures choisies : { [ingredientId]: ["option1", "option2", …] }
  choices: z.record(z.string(), z.array(z.string())).nullish(),
});

export const generateSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mode: z.enum(["fill", "replace"]),
});

export const toggleCheckSchema = z.object({
  rangeStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rangeEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ingredientKey: z.string().min(1),
  checked: z.boolean(),
});
