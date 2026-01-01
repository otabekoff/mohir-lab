// ============================================
// Prisma Configuration (Prisma 7.x)
// ============================================

import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: path.join(__dirname, "schema.prisma"),
});
