"use server";

// ============================================
// Admin Notification Actions
// ============================================

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { NotificationType } from "@/generated/prisma";

// Helper to check admin access
async function checkAdminAccess() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!user || !["owner", "manager"].includes(user.role)) {
        throw new Error("Forbidden");
    }

    return { userId: session.user.id, role: user.role };
}

// Send notification to a single user
export async function sendNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
}) {
    await checkAdminAccess();

    const notification = await prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
        },
    });

    revalidatePath("/dashboard/notifications");
    return notification;
}

// Send notification to multiple users
export async function sendBulkNotification(data: {
    userIds: string[];
    type: NotificationType;
    title: string;
    message: string;
}) {
    await checkAdminAccess();

    const notifications = await prisma.notification.createMany({
        data: data.userIds.map((userId) => ({
            userId,
            type: data.type,
            title: data.title,
            message: data.message,
        })),
    });

    revalidatePath("/dashboard/notifications");
    return { count: notifications.count };
}

// Send notification to all users with a specific role
export async function sendNotificationToRole(data: {
    role: "customer" | "manager";
    type: NotificationType;
    title: string;
    message: string;
}) {
    await checkAdminAccess();

    const users = await prisma.user.findMany({
        where: { role: data.role },
        select: { id: true },
    });

    if (users.length === 0) {
        return { count: 0 };
    }

    const notifications = await prisma.notification.createMany({
        data: users.map((user) => ({
            userId: user.id,
            type: data.type,
            title: data.title,
            message: data.message,
        })),
    });

    revalidatePath("/dashboard/notifications");
    return { count: notifications.count };
}

// Send notification to all students enrolled in a course
export async function sendNotificationToCourseStudents(data: {
    courseId: string;
    type: NotificationType;
    title: string;
    message: string;
}) {
    await checkAdminAccess();

    const enrollments = await prisma.enrollment.findMany({
        where: { courseId: data.courseId },
        select: { userId: true },
    });

    if (enrollments.length === 0) {
        return { count: 0 };
    }

    const notifications = await prisma.notification.createMany({
        data: enrollments.map((enrollment) => ({
            userId: enrollment.userId,
            type: data.type,
            title: data.title,
            message: data.message,
        })),
    });

    revalidatePath("/dashboard/notifications");
    return { count: notifications.count };
}

// Get notification statistics for admin
export async function getNotificationStats() {
    await checkAdminAccess();

    const [total, unread, byType] = await Promise.all([
        prisma.notification.count(),
        prisma.notification.count({ where: { read: false } }),
        prisma.notification.groupBy({
            by: ["type"],
            _count: { type: true },
        }),
    ]);

    return {
        total,
        unread,
        byType: byType.reduce(
            (acc, item) => {
                acc[item.type] = item._count.type;
                return acc;
            },
            {} as Record<string, number>
        ),
    };
}
