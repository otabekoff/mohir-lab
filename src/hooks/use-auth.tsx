"use client";

// ============================================
// Auth Context & Hooks
// ============================================

import { createContext, useContext, type ReactNode } from "react";
import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import type { UserRole } from "@/types";
import { hasPermission, canAccessRoute } from "@/lib/rbac";

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: UserRole;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof nextAuthSignIn;
  signOut: typeof nextAuthSignOut;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (allowedRoles?: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user as AuthContextType["user"] | undefined;

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    signIn: nextAuthSignIn,
    signOut: nextAuthSignOut,
    hasPermission: (permission: string) => {
      if (!user?.role) return false;
      return hasPermission(user.role, permission);
    },
    canAccessRoute: (allowedRoles?: UserRole[]) => {
      if (!user?.role) return false;
      return canAccessRoute(user.role, allowedRoles);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for checking specific permissions
export function usePermission(permission: string) {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Hook for role-based rendering
export function useRole() {
  const { user } = useAuth();
  return user?.role;
}
