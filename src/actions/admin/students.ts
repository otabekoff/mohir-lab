"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/generated/prisma";
import { AuthorizationError, withDatabase } from "@/lib/db-errors";

// Helper to check admin access
async function checkAdminAccess() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new AuthorizationError("You must be logged in to access this resource.");
    }

    return await withDatabase(async () => {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!user || !["owner", "manager"].includes(user.role)) {
            throw new AuthorizationError("You do not have permission to access this resource.");
        }

        return { userId: session.user.id, role: user.role };
    }, 'checkAdminAccess');
}

export async function getStudents(options?: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    await checkAdminAccess();

    return await withDatabase(async () => {
        const search = options?.search;
        const page = options?.page || 1;
        const limit = options?.limit || 10;

        const where: Record<string, unknown> = {
            role: "customer",
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        const [students, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true,
                    _count: {
                        select: {
                            enrollments: true,
                            orders: true,
                            reviews: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    const studentsWithSpending = await Promise.all(
        students.map(async (student) => {
            const totalSpent = await prisma.order.aggregate({
                where: {
                    userId: student.id,
                    status: "completed",
                },
                _sum: { amount: true },
            });

            return {
                ...student,
                enrollmentsCount: student._count.enrollments,
                ordersCount: student._count.orders,
                reviewsCount: student._count.reviews,
                totalSpent: Number(totalSpent._sum.amount || 0),
            };
        }),
    );

        return {
            students: studentsWithSpending,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }, 'getStudents');
}

export async function getStudentById(studentId: string) {
    await checkAdminAccess();

    return await withDatabase(async () => {
        const student = await prisma.user.findUnique({
            where: { id: studentId },
            include: {
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
                },
                orders: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                reviews: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                certificates: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: { issuedAt: "desc" },
                },
            },
        });

        if (!student || student.role !== "customer") {
            return null;
        }

        const totalSpent = await prisma.order.aggregate({
            where: {
                userId: student.id,
                status: "completed",
            },
            _sum: { amount: true },
        });

        return {
            ...student,
            orders: student.orders.map((order) => ({
                ...order,
                amount: Number(order.amount),
            })),
            totalSpent: Number(totalSpent._sum.amount || 0),
        };
    }, 'getStudentById');
}

// Order management
export async function getAdminOrders(options?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}) {
    await checkAdminAccess();

    const search = options?.search;
    const status = options?.status;
    const page = options?.page || 1;
    const limit = options?.limit || 10;

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { course: { title: { contains: search, mode: "insensitive" } } },
        ];
    }

    if (status && status !== "all") {
        where.status = status as OrderStatus;
    }

    const [orders, total, totalRevenue, ordersCount] = await Promise.all([
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
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.order.count({ where }),
        prisma.order.aggregate({
            where: { status: "completed" },
            _sum: { amount: true },
        }),
        prisma.order.count(),
    ]);

    return {
        orders: orders.map((order) => ({
            ...order,
            amount: Number(order.amount),
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        stats: {
            totalRevenue: Number(totalRevenue._sum.amount || 0),
            ordersCount,
        },
    };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    await checkAdminAccess();

    const updateData: {
        status: OrderStatus;
        completedAt?: Date | null;
    } = { status };

    if (status === "completed") {
        updateData.completedAt = new Date();
    } else {
        updateData.completedAt = null;
    }

    const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
    });

    // If completed, create enrollment if it doesn't exist
    if (status === "completed") {
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: order.userId,
                    courseId: order.courseId,
                },
            },
        });

        if (!existingEnrollment) {
            await prisma.enrollment.create({
                data: {
                    userId: order.userId,
                    courseId: order.courseId,
                },
            });
        }
    }

    revalidatePath("/dashboard/orders");

    return { success: true };
}

// Review management
export async function getAdminReviews(options?: {
    search?: string;
    isApproved?: string;
    page?: number;
    limit?: number;
}) {
    await checkAdminAccess();

    const search = options?.search;
    const isApproved = options?.isApproved;
    const page = options?.page || 1;
    const limit = options?.limit || 10;

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { comment: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { course: { title: { contains: search, mode: "insensitive" } } },
        ];
    }

    if (isApproved === "approved") {
        where.isApproved = true;
    } else if (isApproved === "pending") {
        where.isApproved = false;
    }

    const [reviews, total, totalReviews, averageRatingResult, pendingCount] = await Promise.all([
        prisma.review.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true, image: true },
                },
                course: {
                    select: { id: true, title: true, slug: true },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.review.count({ where }),
        prisma.review.count(),
        prisma.review.aggregate({
            _avg: { rating: true },
        }),
        prisma.review.count({ where: { isApproved: false } }),
    ]);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        stats: {
            totalReviews,
            averageRating: averageRatingResult._avg.rating || 0,
            pendingCount,
        },
    };
}

export async function approveReview(reviewId: string) {
    await checkAdminAccess();

    await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved: true },
    });

    revalidatePath("/dashboard/reviews");

    return { success: true };
}

export async function deleteReview(reviewId: string) {
    await checkAdminAccess();

    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { courseId: true },
    });

    await prisma.review.delete({
        where: { id: reviewId },
    });

    // Update course rating
    if (review) {
        const avgRating = await prisma.review.aggregate({
            where: { courseId: review.courseId, isApproved: true },
            _avg: { rating: true },
        });

        await prisma.course.update({
            where: { id: review.courseId },
            data: { rating: avgRating._avg.rating || 0 },
        });
    }

    revalidatePath("/dashboard/reviews");

    return { success: true };
}
