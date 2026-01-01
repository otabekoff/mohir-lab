// ============================================
// NextAuth.js v4 Setup
// ============================================

import { getServerSession } from "next-auth";
import { authOptions } from "./auth.config";
import type { Session } from "next-auth";

// Helper to get session on server
export async function auth(): Promise<Session | null> {
    return await getServerSession(authOptions);
}

// Helper to get current user on server
export async function getCurrentUser() {
    const session = await auth();
    return session?.user;
}

// Helper to require authentication
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

// Helper to require specific role
export async function requireRole(allowedRoles: string[]) {
    const user = await requireAuth();
    if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden");
    }
    return user;
}

export { authOptions };
