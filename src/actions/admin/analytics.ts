"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

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

export async function getAnalyticsOverview(days: number = 30) {
  await checkAdminAccess();
  
  const startDate = startOfDay(subDays(new Date(), days));
  const endDate = endOfDay(new Date());
  
  // Get current period stats
  const [
    totalRevenue,
    totalOrders,
    totalEnrollments,
    totalStudents,
    newStudents,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: "completed",
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    }),
    prisma.order.count({
      where: {
        status: "completed",
        createdAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.enrollment.count({
      where: {
        enrolledAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.user.count({
      where: { role: "customer" },
    }),
    prisma.user.count({
      where: {
        role: "customer",
        createdAt: { gte: startDate, lte: endDate },
      },
    }),
  ]);
  
  // Get previous period stats for comparison
  const prevStartDate = startOfDay(subDays(startDate, days));
  const prevEndDate = startDate;
  
  const [prevRevenue, prevOrders, prevEnrollments, prevStudents] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: "completed",
        createdAt: { gte: prevStartDate, lt: prevEndDate },
      },
      _sum: { amount: true },
    }),
    prisma.order.count({
      where: {
        status: "completed",
        createdAt: { gte: prevStartDate, lt: prevEndDate },
      },
    }),
    prisma.enrollment.count({
      where: {
        enrolledAt: { gte: prevStartDate, lt: prevEndDate },
      },
    }),
    prisma.user.count({
      where: {
        role: "customer",
        createdAt: { gte: prevStartDate, lt: prevEndDate },
      },
    }),
  ]);
  
  function calculateChange(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }
  
  const currentRevenueNum = Number(totalRevenue._sum.amount || 0);
  const prevRevenueNum = Number(prevRevenue._sum.amount || 0);
  
  return {
    revenue: {
      value: currentRevenueNum,
      change: calculateChange(currentRevenueNum, prevRevenueNum),
    },
    orders: {
      value: totalOrders,
      change: calculateChange(totalOrders, prevOrders),
    },
    enrollments: {
      value: totalEnrollments,
      change: calculateChange(totalEnrollments, prevEnrollments),
    },
    students: {
      value: totalStudents,
      newStudents,
      change: calculateChange(newStudents, prevStudents),
    },
  };
}

export async function getRevenueChart(days: number = 30) {
  await checkAdminAccess();
  
  const startDate = startOfDay(subDays(new Date(), days));
  
  const orders = await prisma.order.findMany({
    where: {
      status: "completed",
      createdAt: { gte: startDate },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  
  // Group by day
  const dailyRevenue: Record<string, number> = {};
  
  for (let i = 0; i <= days; i++) {
    const date = format(subDays(new Date(), days - i), "yyyy-MM-dd");
    dailyRevenue[date] = 0;
  }
  
  orders.forEach((order) => {
    const date = format(new Date(order.createdAt), "yyyy-MM-dd");
    if (dailyRevenue[date] !== undefined) {
      dailyRevenue[date] += Number(order.amount);
    }
  });
  
  return Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

export async function getEnrollmentsChart(days: number = 30) {
  await checkAdminAccess();
  
  const startDate = startOfDay(subDays(new Date(), days));
  
  const enrollments = await prisma.enrollment.findMany({
    where: {
      enrolledAt: { gte: startDate },
    },
    select: {
      enrolledAt: true,
    },
    orderBy: { enrolledAt: "asc" },
  });
  
  // Group by day
  const dailyEnrollments: Record<string, number> = {};
  
  for (let i = 0; i <= days; i++) {
    const date = format(subDays(new Date(), days - i), "yyyy-MM-dd");
    dailyEnrollments[date] = 0;
  }
  
  enrollments.forEach((enrollment) => {
    const date = format(new Date(enrollment.enrolledAt), "yyyy-MM-dd");
    if (dailyEnrollments[date] !== undefined) {
      dailyEnrollments[date]++;
    }
  });
  
  return Object.entries(dailyEnrollments).map(([date, count]) => ({
    date,
    enrollments: count,
  }));
}

export async function getTopCourses(limit: number = 5) {
  await checkAdminAccess();
  
  const courses = await prisma.course.findMany({
    orderBy: {
      studentsCount: "desc",
    },
    take: limit,
  });
  
  // Get revenue for each course
  const coursesWithRevenue = await Promise.all(
    courses.map(async (course) => {
      const revenue = await prisma.order.aggregate({
        where: {
          courseId: course.id,
          status: "completed",
        },
        _sum: { amount: true },
      });
      
      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        enrollments: course.studentsCount,
        revenue: Number(revenue._sum.amount || 0),
        rating: course.rating,
      };
    })
  );
  
  return coursesWithRevenue;
}

export async function getCategoryStats() {
  await checkAdminAccess();
  
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
      courses: {
        select: {
          studentsCount: true,
        },
      },
    },
  });
  
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    coursesCount: category._count.courses,
    enrollmentsCount: category.courses.reduce(
      (sum, course) => sum + course.studentsCount,
      0
    ),
  }));
}

export async function getRecentActivity(limit: number = 10) {
  await checkAdminAccess();
  
  const [recentOrders, recentEnrollments, recentReviews] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, image: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.enrollment.findMany({
      include: {
        user: { select: { name: true, email: true, image: true } },
        course: { select: { title: true } },
      },
      orderBy: { enrolledAt: "desc" },
      take: limit,
    }),
    prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true, image: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);
  
  type Activity = {
    id: string;
    type: "order" | "enrollment" | "review";
    user: { name: string; email: string; image: string | null };
    course: string;
    amount?: number;
    rating?: number;
    createdAt: Date;
  };
  
  const activities: Activity[] = [
    ...recentOrders.map((order) => ({
      id: order.id,
      type: "order" as const,
      user: order.user,
      course: order.course.title,
      amount: Number(order.amount),
      createdAt: order.createdAt,
    })),
    ...recentEnrollments.map((enrollment) => ({
      id: enrollment.id,
      type: "enrollment" as const,
      user: enrollment.user,
      course: enrollment.course.title,
      createdAt: enrollment.enrolledAt,
    })),
    ...recentReviews.map((review) => ({
      id: review.id,
      type: "review" as const,
      user: review.user,
      course: review.course.title,
      rating: review.rating,
      createdAt: review.createdAt,
    })),
  ];
  
  // Sort by date and take the most recent
  return activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
