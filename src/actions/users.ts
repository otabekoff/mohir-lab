// ============================================
// User Server Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Get all users with pagination and filtering
export async function getUsers(options?: {
    role?: "owner" | "manager" | "customer";
    search?: string;
    limit?: number;
    offset?: number;
}) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const where: {
        role?: "owner" | "manager" | "customer";
        OR?: {
            name?: { contains: string; mode: "insensitive" };
            email?: { contains: string; mode: "insensitive" };
        }[];
    } = {};

    if (options?.role) {
        where.role = options.role;
    }

    if (options?.search) {
        where.OR = [
            { name: { contains: options.search, mode: "insensitive" } },
            { email: { contains: options.search, mode: "insensitive" } },
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { enrollments: true, reviews: true, orders: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: options?.limit ?? 20,
            skip: options?.offset ?? 0,
        }),
        prisma.user.count({ where }),
    ]);

    return { users, total };
}

// Get single user by ID
export async function getUserById(userId: string) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            role: true,
            createdAt: true,
            enrollments: {
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            thumbnail: true,
                        },
                    },
                },
                orderBy: { enrolledAt: "desc" },
                take: 10,
            },
            orders: {
                include: {
                    course: {
                        select: { id: true, title: true, slug: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            reviews: {
                include: {
                    course: {
                        select: { id: true, title: true, slug: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            _count: {
                select: {
                    enrollments: true,
                    reviews: true,
                    orders: true,
                    certificates: true,
                },
            },
        },
    });

    return user;
}

// Update user role (owner only)
export async function updateUserRole(
    userId: string,
    role: "owner" | "manager" | "customer",
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "owner") {
        throw new Error("Unauthorized - Only owners can change roles");
    }

    // Prevent changing own role
    if (userId === session.user.id) {
        throw new Error("Cannot change your own role");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard/students");

    return { success: true };
}

// Create team member (owner only)
export async function createTeamMember(data: {
    name: string;
    email: string;
    password: string;
    role: "manager";
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "owner") {
        throw new Error("Unauthorized - Only owners can create team members");
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        },
    });

    revalidatePath("/dashboard/team");

    return { success: true, userId: user.id };
}

// Delete user (owner only, cannot delete owners)
export async function deleteUser(userId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "owner") {
        throw new Error("Unauthorized");
    }

    const userToDelete = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    if (!userToDelete) {
        throw new Error("User not found");
    }

    if (userToDelete.role === "owner") {
        throw new Error("Cannot delete owner accounts");
    }

    if (userId === session.user.id) {
        throw new Error("Cannot delete your own account");
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard/students");

    return { success: true };
}

// Get team members (managers and owners)
export async function getTeamMembers() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "owner") {
        throw new Error("Unauthorized");
    }

    const teamMembers = await prisma.user.findMany({
        where: {
            role: { in: ["owner", "manager"] },
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
        },
        orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    });

    return teamMembers;
}

// Update current user profile
export async function updateProfile(data: {
    name?: string;
    bio?: string;
    image?: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            bio: data.bio,
            image: data.image,
        },
    });

    revalidatePath("/dashboard/settings");

    return { success: true };
}

// Change password
export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
    });

    if (!user?.password) {
        throw new Error("No password set for this account");
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);

    if (!isValid) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
    });

    return { success: true };
}
