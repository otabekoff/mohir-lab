// ============================================
// Authentication Configuration (NextAuth.js v4)
// ============================================

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";

// Extend the built-in types
declare module "next-auth" {
    interface User {
        role: UserRole;
    }
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image?: string | null;
            role: UserRole;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Handle localhost URLs in production
            if (url.includes("localhost")) {
                return baseUrl + "/dashboard";
            }
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl + "/dashboard";
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id!;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role as UserRole,
                };
            },
        }),
    ],
};
