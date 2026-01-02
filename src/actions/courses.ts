// ============================================
// Course Server Actions
// ============================================

"use server";

import prisma from "@/lib/prisma";
import { CourseLevel, type Prisma } from "@/generated/prisma";

// Types for frontend use
export type CourseWithCategory = Prisma.CourseGetPayload<{
    include: { category: true };
}>;

export type CourseWithDetails = Prisma.CourseGetPayload<{
    include: {
        category: true;
        sections: {
            include: {
                lessons: {
                    select: {
                        id: true;
                        title: true;
                        type: true;
                        duration: true;
                        isFree: true;
                        order: true;
                        videoUrl: true;
                    };
                };
            };
        };
        reviews: {
            include: {
                user: {
                    select: {
                        id: true;
                        name: true;
                        image: true;
                    };
                };
            };
            take: 5;
        };
    };
}>;

// Get all published courses with optional filters
export async function getCourses(options?: {
    category?: string;
    level?: CourseLevel;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
}): Promise<{ courses: CourseWithCategory[]; total: number }> {
    const where: Prisma.CourseWhereInput = {
        isPublished: true,
    };

    if (options?.category) {
        where.category = { slug: options.category };
    }

    if (options?.level) {
        where.level = options.level;
    }

    if (options?.featured) {
        where.isFeatured = true;
    }

    if (options?.search) {
        where.OR = [
            { title: { contains: options.search, mode: "insensitive" } },
            {
                shortDescription: {
                    contains: options.search,
                    mode: "insensitive",
                },
            },
            { instructor: { contains: options.search, mode: "insensitive" } },
        ];
    }

    const [courses, total] = await Promise.all([
        prisma.course.findMany({
            where,
            include: { category: true },
            orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
            take: options?.limit ?? 20,
            skip: options?.offset ?? 0,
        }),
        prisma.course.count({ where }),
    ]);

    return { courses, total };
}

// Get featured courses
export async function getFeaturedCourses(
    limit = 6,
): Promise<CourseWithCategory[]> {
    const courses = await prisma.course.findMany({
        where: {
            isPublished: true,
            isFeatured: true,
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return courses;
}

// Get a single course by slug (includes videoUrl for free lessons only)
export async function getCourseBySlug(
    slug: string,
): Promise<CourseWithDetails | null> {
    const course = await prisma.course.findFirst({
        where: {
            slug,
            isPublished: true,
        },
        include: {
            category: true,
            sections: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                        select: {
                            id: true,
                            title: true,
                            type: true,
                            duration: true,
                            isFree: true,
                            order: true,
                            videoUrl: true, // Include video URL - we'll filter in code
                        },
                    },
                },
            },
            reviews: {
                where: { isApproved: true },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 5,
            },
        },
    });

    if (!course) return null;

    // Only expose videoUrl for free lessons
    const sanitizedCourse = {
        ...course,
        sections: course.sections.map((section) => ({
            ...section,
            lessons: section.lessons.map((lesson) => ({
                ...lesson,
                // Only include videoUrl if lesson is free
                videoUrl: lesson.isFree ? lesson.videoUrl : undefined,
            })),
        })),
    };

    return sanitizedCourse as CourseWithDetails;
}

// Get course for learning (with video URLs for enrolled users)
export async function getCourseForLearning(slug: string) {
    const course = await prisma.course.findFirst({
        where: {
            slug,
            isPublished: true,
        },
        include: {
            category: true,
            sections: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                        include: {
                            resources: true,
                            questions: {
                                orderBy: { order: "asc" },
                                include: {
                                    options: {
                                        orderBy: { order: "asc" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return course;
}

// Get related courses (same category)
export async function getRelatedCourses(
    courseId: string,
    categoryId: string,
    limit = 4,
): Promise<CourseWithCategory[]> {
    const courses = await prisma.course.findMany({
        where: {
            isPublished: true,
            categoryId,
            id: { not: courseId },
        },
        include: { category: true },
        orderBy: { studentsCount: "desc" },
        take: limit,
    });

    return courses;
}

// Get course curriculum (sections with lessons)
export async function getCourseCurriculum(courseId: string) {
    const sections = await prisma.section.findMany({
        where: { courseId },
        orderBy: { order: "asc" },
        include: {
            lessons: {
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    duration: true,
                    isFree: true,
                    order: true,
                },
            },
        },
    });

    return sections;
}

// Get course statistics
export async function getCourseStats(courseId: string) {
    const [enrollments, reviews, revenue] = await Promise.all([
        prisma.enrollment.count({ where: { courseId } }),
        prisma.review.aggregate({
            where: { courseId },
            _avg: { rating: true },
            _count: { id: true },
        }),
        prisma.order.aggregate({
            where: { courseId, status: "completed" },
            _sum: { amount: true },
        }),
    ]);

    return {
        enrollments,
        averageRating: reviews._avg.rating || 0,
        reviewsCount: reviews._count.id,
        revenue: revenue._sum.amount || 0,
    };
}

// Search courses
export async function searchCourses(
    query: string,
    limit = 10,
): Promise<CourseWithCategory[]> {
    const courses = await prisma.course.findMany({
        where: {
            isPublished: true,
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { shortDescription: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { instructor: { contains: query, mode: "insensitive" } },
                {
                    category: {
                        name: { contains: query, mode: "insensitive" },
                    },
                },
            ],
        },
        include: { category: true },
        orderBy: { studentsCount: "desc" },
        take: limit,
    });

    return courses;
}

// Get popular courses
export async function getPopularCourses(
    limit = 8,
): Promise<CourseWithCategory[]> {
    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: { studentsCount: "desc" },
        take: limit,
    });

    return courses;
}

// Get new courses
export async function getNewCourses(limit = 8): Promise<CourseWithCategory[]> {
    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: limit,
    });

    return courses;
}

// For admin: Get all courses including unpublished
export async function getAllCoursesAdmin(): Promise<CourseWithCategory[]> {
    const courses = await prisma.course.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return courses;
}
