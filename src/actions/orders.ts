// ============================================
// Orders Server Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import { revalidatePath } from "next/cache";

// Get all orders with pagination
export async function getOrders(options?: {
    status?: "pending" | "completed" | "failed" | "refunded";
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
        status?: "pending" | "completed" | "failed" | "refunded";
        OR?: {
            user?: { name: { contains: string; mode: "insensitive" } };
            course?: { title: { contains: string; mode: "insensitive" } };
        }[];
    } = {};

    if (options?.status) {
        where.status = options.status;
    }

    if (options?.search) {
        where.OR = [
            {
                user: {
                    name: { contains: options.search, mode: "insensitive" },
                },
            },
            {
                course: {
                    title: { contains: options.search, mode: "insensitive" },
                },
            },
        ];
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true, image: true },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: options?.limit ?? 20,
            skip: options?.offset ?? 0,
        }),
        prisma.order.count({ where }),
    ]);

    return { orders, total };
}

// Get single order by ID
export async function getOrderById(orderId: string) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    thumbnail: true,
                    price: true,
                    discountPrice: true,
                },
            },
        },
    });

    return order;
}

// Update order status
export async function updateOrderStatus(
    orderId: string,
    status: "pending" | "completed" | "failed" | "refunded",
) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const updateData: {
        status: "pending" | "completed" | "failed" | "refunded";
        completedAt?: Date | null;
    } = { status };

    if (status === "completed") {
        updateData.completedAt = new Date();
    } else {
        updateData.completedAt = null;
    }

    await prisma.order.update({
        where: { id: orderId },
        data: updateData,
    });

    revalidatePath("/dashboard/orders");

    return { success: true };
}

// Get order stats
export async function getOrderStats() {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const [
        totalOrders,
        completedOrders,
        pendingOrders,
        refundedOrders,
        totalRevenue,
    ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "completed" } }),
        prisma.order.count({ where: { status: "pending" } }),
        prisma.order.count({ where: { status: "refunded" } }),
        prisma.order.aggregate({
            where: { status: "completed" },
            _sum: { amount: true },
        }),
    ]);

    return {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        refunded: refundedOrders,
        revenue: Number(totalRevenue._sum.amount || 0),
    };
}

// Get user's orders
export async function getUserOrders() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
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
        orderBy: { createdAt: "desc" },
    });

    return orders;
}

// Refund order (owner only)
export async function refundOrder(orderId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "owner") {
        throw new Error("Unauthorized - Only owners can process refunds");
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true, userId: true, courseId: true },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.status !== "completed") {
        throw new Error("Only completed orders can be refunded");
    }

    // Update order status and remove enrollment
    await prisma.$transaction([
        prisma.order.update({
            where: { id: orderId },
            data: { status: "refunded" },
        }),
        prisma.enrollment.deleteMany({
            where: { userId: order.userId, courseId: order.courseId },
        }),
    ]);

    // Update course student count
    await prisma.course.update({
        where: { id: order.courseId },
        data: { studentsCount: { decrement: 1 } },
    });

    revalidatePath("/dashboard/orders");

    return { success: true };
}
