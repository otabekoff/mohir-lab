// ============================================
// Review Server Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import { type Prisma } from "@/generated/prisma";

export type ReviewWithUser = Prisma.ReviewGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                image: true;
            };
        };
    };
}>;

// Get reviews for a course
export async function getCourseReviews(
    courseId: string,
    options?: { limit?: number; offset?: number },
): Promise<{ reviews: ReviewWithUser[]; total: number }> {
    const where = {
        courseId,
        isApproved: true,
    };

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where,
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
            take: options?.limit ?? 10,
            skip: options?.offset ?? 0,
        }),
        prisma.review.count({ where }),
    ]);

    return { reviews, total };
}

// Get reviews by slug (for course page)
export async function getCourseReviewsBySlug(
    slug: string,
    limit = 10,
): Promise<ReviewWithUser[]> {
    const course = await prisma.course.findUnique({
        where: { slug },
        select: { id: true },
    });

    if (!course) return [];

    const reviews = await prisma.review.findMany({
        where: {
            courseId: course.id,
            isApproved: true,
        },
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
        take: limit,
    });

    return reviews;
}

// Add a review
export async function addReview(data: {
    courseId: string;
    rating: number;
    comment: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in to leave a review");
    }

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: data.courseId,
            },
        },
    });

    if (!enrollment) {
        throw new Error(
            "You must be enrolled in this course to leave a review",
        );
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: data.courseId,
            },
        },
    });

    if (existingReview) {
        throw new Error("You have already reviewed this course");
    }

    const review = await prisma.review.create({
        data: {
            userId: session.user.id,
            courseId: data.courseId,
            rating: data.rating,
            comment: data.comment,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    // Update course rating
    const stats = await prisma.review.aggregate({
        where: { courseId: data.courseId, isApproved: true },
        _avg: { rating: true },
        _count: { id: true },
    });

    await prisma.course.update({
        where: { id: data.courseId },
        data: {
            rating: stats._avg.rating || 0,
            reviewsCount: stats._count.id,
        },
    });

    revalidatePath(`/courses/[slug]`, "page");

    return review;
}

// Update a review
export async function updateReview(
    reviewId: string,
    data: { rating?: number; comment?: string },
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review || review.userId !== session.user.id) {
        throw new Error("Review not found or unauthorized");
    }

    const updated = await prisma.review.update({
        where: { id: reviewId },
        data,
    });

    // Update course rating
    const stats = await prisma.review.aggregate({
        where: { courseId: review.courseId, isApproved: true },
        _avg: { rating: true },
    });

    await prisma.course.update({
        where: { id: review.courseId },
        data: { rating: stats._avg.rating || 0 },
    });

    revalidatePath(`/courses/[slug]`, "page");

    return updated;
}

// Delete a review
export async function deleteReview(reviewId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new Error("Review not found");
    }

    // Allow if owner or admin
    if (
        review.userId !== session.user.id && session.user.role !== "owner" &&
        session.user.role !== "manager"
    ) {
        throw new Error("Unauthorized");
    }

    await prisma.review.delete({ where: { id: reviewId } });

    // Update course rating
    const stats = await prisma.review.aggregate({
        where: { courseId: review.courseId, isApproved: true },
        _avg: { rating: true },
        _count: { id: true },
    });

    await prisma.course.update({
        where: { id: review.courseId },
        data: {
            rating: stats._avg.rating || 0,
            reviewsCount: stats._count.id,
        },
    });

    revalidatePath(`/courses/[slug]`, "page");
}

// Get review stats for a course
export async function getReviewStats(courseId: string) {
    const reviews = await prisma.review.findMany({
        where: { courseId, isApproved: true },
        select: { rating: true },
    });

    const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach((r) => {
        distribution[r.rating - 1]++;
    });

    const total = reviews.length;
    const average = total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    return {
        average,
        total,
        distribution: distribution.map((count, index) => ({
            stars: index + 1,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0,
        })),
    };
}

// Get pending reviews (for moderation)
export async function getPendingReviews(limit = 10) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const reviews = await prisma.review.findMany({
        where: { isApproved: false },
        include: {
            user: {
                select: { id: true, name: true, image: true, email: true },
            },
            course: {
                select: { id: true, title: true, slug: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return reviews;
}

// Get all reviews (for admin)
export async function getAllReviews(options?: {
    isApproved?: boolean;
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

    const where: { isApproved?: boolean } = {};
    if (options?.isApproved !== undefined) {
        where.isApproved = options.isApproved;
    }

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, image: true, email: true },
                },
                course: {
                    select: { id: true, title: true, slug: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: options?.limit ?? 20,
            skip: options?.offset ?? 0,
        }),
        prisma.review.count({ where }),
    ]);

    return { reviews, total };
}

// Approve review
export async function approveReview(reviewId: string) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    const review = await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved: true },
    });

    // Update course rating
    const stats = await prisma.review.aggregate({
        where: { courseId: review.courseId, isApproved: true },
        _avg: { rating: true },
        _count: { id: true },
    });

    await prisma.course.update({
        where: { id: review.courseId },
        data: {
            rating: stats._avg.rating || 0,
            reviewsCount: stats._count.id,
        },
    });

    revalidatePath("/dashboard/reviews");
    revalidatePath(`/courses/[slug]`, "page");

    return review;
}

// Reject/delete review
export async function rejectReview(reviewId: string) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.id ||
        (session.user.role !== "owner" && session.user.role !== "manager")
    ) {
        throw new Error("Unauthorized");
    }

    await prisma.review.delete({ where: { id: reviewId } });

    revalidatePath("/dashboard/reviews");

    return { success: true };
}
