// ============================================
// Dashboard Server Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import { format, startOfMonth, subMonths } from "date-fns";

// Owner/Manager Dashboard Stats
export async function getDashboardStats() {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const [
        totalCourses,
        publishedCourses,
        totalStudents,
        totalEnrollments,
        thisMonthEnrollments,
        lastMonthEnrollments,
        totalRevenue,
        thisMonthRevenue,
        lastMonthRevenue,
        totalReviews,
        averageRating,
    ] = await Promise.all([
        prisma.course.count(),
        prisma.course.count({ where: { isPublished: true } }),
        prisma.user.count({ where: { role: "customer" } }),
        prisma.enrollment.count(),
        prisma.enrollment.count({
            where: { enrolledAt: { gte: thisMonthStart } },
        }),
        prisma.enrollment.count({
            where: {
                enrolledAt: { gte: lastMonthStart, lt: thisMonthStart },
            },
        }),
        prisma.order.aggregate({
            where: { status: "completed" },
            _sum: { amount: true },
        }),
        prisma.order.aggregate({
            where: {
                status: "completed",
                completedAt: { gte: thisMonthStart },
            },
            _sum: { amount: true },
        }),
        prisma.order.aggregate({
            where: {
                status: "completed",
                completedAt: { gte: lastMonthStart, lt: thisMonthStart },
            },
            _sum: { amount: true },
        }),
        prisma.review.count({ where: { isApproved: true } }),
        prisma.review.aggregate({
            where: { isApproved: true },
            _avg: { rating: true },
        }),
    ]);

    // Calculate growth percentages
    const enrollmentGrowth = lastMonthEnrollments > 0
        ? ((thisMonthEnrollments - lastMonthEnrollments) /
            lastMonthEnrollments) * 100
        : thisMonthEnrollments > 0
        ? 100
        : 0;

    const thisMonthRevenueValue = Number(thisMonthRevenue._sum.amount || 0);
    const lastMonthRevenueValue = Number(lastMonthRevenue._sum.amount || 0);
    const revenueGrowth = lastMonthRevenueValue > 0
        ? ((thisMonthRevenueValue - lastMonthRevenueValue) /
            lastMonthRevenueValue) * 100
        : thisMonthRevenueValue > 0
        ? 100
        : 0;

    return {
        courses: {
            total: totalCourses,
            published: publishedCourses,
            draft: totalCourses - publishedCourses,
        },
        students: {
            total: totalStudents,
            thisMonth: await prisma.user.count({
                where: { role: "customer", createdAt: { gte: thisMonthStart } },
            }),
        },
        enrollments: {
            total: totalEnrollments,
            thisMonth: thisMonthEnrollments,
            lastMonth: lastMonthEnrollments,
            growth: enrollmentGrowth,
        },
        revenue: {
            total: Number(totalRevenue._sum.amount || 0),
            thisMonth: thisMonthRevenueValue,
            lastMonth: lastMonthRevenueValue,
            growth: revenueGrowth,
        },
        reviews: {
            total: totalReviews,
            averageRating: averageRating._avg.rating || 0,
        },
    };
}

// Get revenue chart data (last 6 months)
export async function getRevenueChartData() {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(now, i));
        const monthEnd = startOfMonth(subMonths(now, i - 1));

        const revenue = await prisma.order.aggregate({
            where: {
                status: "completed",
                completedAt: { gte: monthStart, lt: monthEnd },
            },
            _sum: { amount: true },
        });

        const enrollments = await prisma.enrollment.count({
            where: { enrolledAt: { gte: monthStart, lt: monthEnd } },
        });

        months.push({
            month: format(monthStart, "MMM"),
            revenue: Number(revenue._sum.amount || 0),
            enrollments,
        });
    }

    return months;
}

// Get enrollment chart data
export async function getEnrollmentChartData() {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(now, i));
        const monthEnd = startOfMonth(subMonths(now, i - 1));

        const enrollments = await prisma.enrollment.count({
            where: { enrolledAt: { gte: monthStart, lt: monthEnd } },
        });

        const completions = await prisma.enrollment.count({
            where: { completedAt: { gte: monthStart, lt: monthEnd } },
        });

        months.push({
            month: format(monthStart, "MMM"),
            enrollments,
            completions,
        });
    }

    return months;
}

// Get top performing courses
export async function getTopCourses(limit = 5) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        include: {
            category: true,
            _count: {
                select: { enrollments: true, reviews: true },
            },
        },
        orderBy: { studentsCount: "desc" },
        take: limit,
    });

    // Get revenue for each course
    const coursesWithRevenue = await Promise.all(
        courses.map(async (course) => {
            const revenue = await prisma.order.aggregate({
                where: { courseId: course.id, status: "completed" },
                _sum: { amount: true },
            });

            return {
                id: course.id,
                title: course.title,
                slug: course.slug,
                thumbnail: course.thumbnail,
                category: course.category.name,
                students: course.studentsCount,
                rating: course.rating,
                reviews: course._count.reviews,
                revenue: Number(revenue._sum.amount || 0),
            };
        }),
    );

    return coursesWithRevenue;
}

// Get recent orders
export async function getRecentOrders(limit = 10) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const orders = await prisma.order.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            course: {
                select: { id: true, title: true, slug: true, thumbnail: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return orders;
}

// Get recent enrollments
export async function getRecentEnrollments(limit = 10) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const enrollments = await prisma.enrollment.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true },
            },
            course: {
                select: { id: true, title: true, slug: true, thumbnail: true },
            },
        },
        orderBy: { enrolledAt: "desc" },
        take: limit,
    });

    return enrollments;
}

// Customer Dashboard Stats
export async function getCustomerDashboardStats() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    const [
        totalEnrollments,
        completedCourses,
        inProgressCourses,
        totalCertificates,
        totalWatchTime,
    ] = await Promise.all([
        prisma.enrollment.count({ where: { userId: session.user.id } }),
        prisma.enrollment.count({
            where: { userId: session.user.id, completedAt: { not: null } },
        }),
        prisma.enrollment.count({
            where: {
                userId: session.user.id,
                completedAt: null,
                progress: { gt: 0 },
            },
        }),
        prisma.certificate.count({ where: { userId: session.user.id } }),
        prisma.lessonProgress.aggregate({
            where: { userId: session.user.id },
            _sum: { watchedSeconds: true },
        }),
    ]);

    // Calculate average progress
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id, completedAt: null },
        select: { progress: true },
    });

    const averageProgress = enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + e.progress, 0) /
            enrollments.length
        : 0;

    return {
        enrollments: {
            total: totalEnrollments,
            completed: completedCourses,
            inProgress: inProgressCourses,
        },
        certificates: totalCertificates,
        watchTime: {
            seconds: totalWatchTime._sum.watchedSeconds || 0,
            hours: Math.round((totalWatchTime._sum.watchedSeconds || 0) / 3600),
        },
        averageProgress,
    };
}

// Get all users (admin)
export async function getAllUsers(
    options?: { role?: string; limit?: number; offset?: number },
) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const where: { role?: "owner" | "manager" | "customer" } = {};
    if (options?.role) {
        where.role = options.role as "owner" | "manager" | "customer";
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
                    select: { enrollments: true, reviews: true },
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
