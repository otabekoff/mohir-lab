// ============================================
// Middleware for Protected Routes (NextAuth v4)
// ============================================

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require specific roles
const roleBasedRoutes: Record<string, string[]> = {
    "/dashboard/courses/new": ["owner", "manager"],
    "/dashboard/courses/edit": ["owner", "manager"],
    "/dashboard/categories": ["owner", "manager"],
    "/dashboard/students": ["owner", "manager"],
    "/dashboard/orders": ["owner", "manager"],
    "/dashboard/analytics": ["owner", "manager"],
    "/dashboard/team": ["owner"],
    "/dashboard/permissions": ["owner"],
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token using next-auth/jwt
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthenticated = !!token;
    const userRole = token?.role as string | undefined;

    // Check if accessing protected routes
    if (!isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
        if (pathname.startsWith(route)) {
            if (!userRole || !allowedRoles.includes(userRole)) {
                return NextResponse.redirect(
                    new URL("/dashboard", request.url),
                );
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/learn/:path*",
        "/api/video/:path*",
    ],
};
