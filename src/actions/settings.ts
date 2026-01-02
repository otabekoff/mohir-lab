"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            emailVerified: true,
            createdAt: true,
        },
    });

    return user;
}

export async function updateProfile(data: {
    name?: string;
    image?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            image: data.image,
        },
    });

    revalidatePath("/dashboard/settings");
    return user;
}

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
    });

    if (!user?.password) {
        throw new Error("Password login not enabled for this account");
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
    });

    return { success: true };
}

export async function deleteAccount() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Check if owner - owners cannot delete their account
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (user?.role === "owner") {
        throw new Error(
            "Owners cannot delete their account. Transfer ownership first.",
        );
    }

    // Delete user data
    await prisma.$transaction([
        prisma.review.deleteMany({ where: { userId: session.user.id } }),
        prisma.lessonProgress.deleteMany({
            where: { userId: session.user.id },
        }),
        prisma.enrollment.deleteMany({ where: { userId: session.user.id } }),
        prisma.order.deleteMany({ where: { userId: session.user.id } }),
        prisma.notification.deleteMany({ where: { userId: session.user.id } }),
        prisma.session.deleteMany({ where: { userId: session.user.id } }),
        prisma.account.deleteMany({ where: { userId: session.user.id } }),
        prisma.user.delete({ where: { id: session.user.id } }),
    ]);

    return { success: true };
}

// Notifications
export async function getNotifications(options?: {
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        return {
            notifications: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
            unreadCount: 0,
        };
    }

    const { unreadOnly, page = 1, limit = 10 } = options || {};

    const where: { userId: string; read?: boolean } = {
        userId: session.user.id,
    };

    if (unreadOnly) {
        where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
            where: {
                userId: session.user.id,
                read: false,
            },
        }),
    ]);

    return {
        notifications,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        unreadCount,
    };
}

export async function markNotificationAsRead(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.notification.update({
        where: {
            id: notificationId,
            userId: session.user.id,
        },
        data: { read: true },
    });

    revalidatePath("/dashboard/notifications");
}

export async function markAllNotificationsAsRead() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.notification.updateMany({
        where: {
            userId: session.user.id,
            read: false,
        },
        data: { read: true },
    });

    revalidatePath("/dashboard/notifications");
}

export async function deleteNotification(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.notification.delete({
        where: {
            id: notificationId,
            userId: session.user.id,
        },
    });

    revalidatePath("/dashboard/notifications");
}
