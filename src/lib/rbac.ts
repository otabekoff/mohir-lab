// ============================================
// RBAC (Role-Based Access Control) Utilities
// ============================================

import type { UserRole } from "@/types";
import { rolePermissions } from "./constants";

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
    const permissions = rolePermissions[role];
    return permissions?.includes(permission) ?? false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
    role: UserRole,
    permissions: string[],
): boolean {
    return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
    role: UserRole,
    permissions: string[],
): boolean {
    return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Check if a user role is at least at a certain level
 * Hierarchy: owner > manager > customer
 */
export function isRoleAtLeast(
    userRole: UserRole,
    requiredRole: UserRole,
): boolean {
    const roleHierarchy: Record<UserRole, number> = {
        owner: 3,
        manager: 2,
        customer: 1,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(
    userRole: UserRole,
    allowedRoles?: UserRole[],
): boolean {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(userRole);
}

/**
 * Get dashboard home path based on role
 */
export function getDashboardPath(role: UserRole): string {
    switch (role) {
        case "owner":
        case "manager":
            return "/dashboard";
        case "customer":
            return "/dashboard";
        default:
            return "/";
    }
}

/**
 * Check if user can manage courses (create/edit/delete)
 */
export function canManageCourses(role: UserRole): boolean {
    return hasPermission(role, "manage:courses");
}

/**
 * Check if user can view analytics
 */
export function canViewAnalytics(role: UserRole): boolean {
    return hasPermission(role, "view:analytics");
}

/**
 * Check if user can manage team members
 */
export function canManageTeam(role: UserRole): boolean {
    return hasPermission(role, "manage:team");
}

/**
 * Role display names
 */
export const roleDisplayNames: Record<UserRole, string> = {
    owner: "Owner",
    manager: "Manager",
    customer: "Student",
};

/**
 * Get role badge color
 */
export function getRoleBadgeVariant(
    role: UserRole,
): "default" | "secondary" | "destructive" | "outline" {
    switch (role) {
        case "owner":
            return "destructive";
        case "manager":
            return "default";
        case "customer":
            return "secondary";
        default:
            return "outline";
    }
}
