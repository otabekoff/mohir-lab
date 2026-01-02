// ============================================
// Prisma Client Configuration (Prisma 7.x)
// ============================================

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const connectionString = process.env.DATABASE_URL!;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    const adapter = new PrismaPg({
        connectionString,
        // Pool configuration is handled at the connection string level
        // or through environment variables
    });
    
    const client = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' 
            ? ['warn', 'error']
            : ['error'],
    });

    // Handle connection errors gracefully
    client.$on('error', (e) => {
        console.error('Prisma error:', e);
    });

    return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
