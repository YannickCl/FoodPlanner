import "dotenv/config";
import { defineConfig } from "prisma/config";

// Le CLI Prisma (migrate, db) utilise une connexion DIRECTE (port 5432 chez Supabase).
// On retombe sur DATABASE_URL si DIRECT_URL n'est pas défini.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
