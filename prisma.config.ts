// ============================================
// Prisma Configuration (Prisma 7.x)
// ============================================

import path from "node:path";
import { defineConfig } from "prisma/config";

// Load environment variables
import "dotenv/config";

export default defineConfig({
    schema: path.join(__dirname, "prisma", "schema.prisma"),

    // Datasource URL for migrations
    datasource: {
        url: process.env.DATABASE_URL,
    },

    // Seed configuration
    migrations: {
        seed: "npx tsx ./prisma/seed.ts",
    },
});
