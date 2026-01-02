// ============================================
// Enrollment Server Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import { type Prisma } from "@/generated/prisma";

export type EnrollmentWithCourse = Prisma.EnrollmentGetPayload<{
    include: {
        course: {
            include: {
                category: true;
            };
        };
    };
}>;

// Get user's enrollments
export async function getUserEnrollments(): Promise<EnrollmentWithCourse[]> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
            course: {
                include: { category: true },
            },
        },
        orderBy: { lastAccessAt: "desc" },
    });

    return enrollments;
}

// Check if user is enrolled in a course
export async function isEnrolled(courseId: string): Promise<boolean> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return false;
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId,
            },
        },
    });

    return !!enrollment;
}

// Check enrollment by slug
export async function isEnrolledBySlug(slug: string): Promise<boolean> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return false;
    }

    const course = await prisma.course.findUnique({
        where: { slug },
        select: { id: true },
    });

    if (!course) return false;

    return isEnrolled(course.id);
}

// Get enrollment by course slug
export async function getEnrollmentBySlug(slug: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const course = await prisma.course.findUnique({
        where: { slug },
        select: { id: true },
    });

    if (!course) return null;

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: course.id,
            },
        },
    });

    return enrollment;
}

// Enroll in a course (after successful payment)
export async function enrollInCourse(courseId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in to enroll");
    }

    try {
        // Check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (existing) {
            throw new Error("You are already enrolled in this course");
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: session.user.id,
                courseId,
            },
            include: {
                course: true,
            },
        });

        // Update course student count
        await prisma.course.update({
            where: { id: courseId },
            data: { studentsCount: { increment: 1 } },
        });

        revalidatePath("/dashboard");
        revalidatePath(`/courses/[slug]`, "page");
        revalidatePath("/dashboard/my-courses");

        return enrollment;
    } catch (error) {
        console.error("Enrollment error:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to enroll. Please try again.");
    }
}

// Update enrollment progress
export async function updateEnrollmentProgress(
    courseId: string,
    progress: number,
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    const isCompleted = progress >= 100;

    const enrollment = await prisma.enrollment.update({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId,
            },
        },
        data: {
            progress: Math.min(progress, 100),
            lastAccessAt: new Date(),
            completedAt: isCompleted ? new Date() : null,
        },
    });

    // Auto-generate certificate when course is completed
    if (isCompleted) {
        try {
            // Check if certificate already exists
            const existingCert = await prisma.certificate.findUnique({
                where: {
                    userId_courseId: {
                        userId: session.user.id,
                        courseId,
                    },
                },
            });

            if (!existingCert) {
                // Generate certificate ID
                const certId = `MOHIR-${Date.now().toString(36).toUpperCase()}-${
                    session.user.id.slice(-4).toUpperCase()
                }`;

                await prisma.certificate.create({
                    data: {
                        userId: session.user.id,
                        courseId,
                        certificateId: certId,
                    },
                });

                revalidatePath("/dashboard/certificates");
            }
        } catch (error) {
            console.error("Failed to generate certificate:", error);
            // Don't throw - enrollment progress is more important
        }
    }

    return enrollment;
}

// Get enrollment with progress
export async function getEnrollmentWithProgress(courseId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId,
            },
        },
        include: {
            course: {
                include: {
                    sections: {
                        include: {
                            lessons: {
                                select: { id: true },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!enrollment) return null;

    // Get lesson progress
    const lessonProgress = await prisma.lessonProgress.findMany({
        where: {
            userId: session.user.id,
            lesson: {
                section: {
                    courseId,
                },
            },
        },
    });

    const totalLessons = enrollment.course.sections.reduce(
        (sum, section) => sum + section.lessons.length,
        0,
    );
    const completedLessons =
        lessonProgress.filter((lp) => lp.isCompleted).length;

    return {
        ...enrollment,
        lessonProgress,
        totalLessons,
        completedLessons,
        calculatedProgress: totalLessons > 0
            ? (completedLessons / totalLessons) * 100
            : 0,
    };
}

// Mark lesson as complete
export async function markLessonComplete(lessonId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
            section: {
                include: {
                    course: true,
                },
            },
        },
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: lesson.section.courseId,
            },
        },
    });

    if (!enrollment) {
        throw new Error("You are not enrolled in this course");
    }

    // Update or create lesson progress
    await prisma.lessonProgress.upsert({
        where: {
            userId_lessonId: {
                userId: session.user.id,
                lessonId,
            },
        },
        create: {
            userId: session.user.id,
            lessonId,
            isCompleted: true,
            completedAt: new Date(),
        },
        update: {
            isCompleted: true,
            completedAt: new Date(),
        },
    });

    // Recalculate enrollment progress
    const courseId = lesson.section.courseId;
    const allLessons = await prisma.lesson.count({
        where: { section: { courseId } },
    });

    const completedLessons = await prisma.lessonProgress.count({
        where: {
            userId: session.user.id,
            isCompleted: true,
            lesson: { section: { courseId } },
        },
    });

    const progress = allLessons > 0 ? (completedLessons / allLessons) * 100 : 0;
    const isCompleted = progress >= 100;

    await prisma.enrollment.update({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId,
            },
        },
        data: {
            progress,
            lastAccessAt: new Date(),
            completedAt: isCompleted ? new Date() : null,
        },
    });

    // Auto-generate certificate when course is completed
    if (isCompleted) {
        try {
            const existingCert = await prisma.certificate.findUnique({
                where: {
                    userId_courseId: {
                        userId: session.user.id,
                        courseId,
                    },
                },
            });

            if (!existingCert) {
                const certId = `MOHIR-${Date.now().toString(36).toUpperCase()}-${
                    session.user.id.slice(-4).toUpperCase()
                }`;

                await prisma.certificate.create({
                    data: {
                        userId: session.user.id,
                        courseId,
                        certificateId: certId,
                    },
                });

                revalidatePath("/dashboard/certificates");
            }
        } catch (error) {
            console.error("Failed to generate certificate:", error);
        }
    }

    revalidatePath(`/learn/${lesson.section.course.slug}`);

    return { progress, isCompleted };
}

// Get lesson progress for a specific lesson
export async function getLessonProgress(lessonId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const progress = await prisma.lessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId: session.user.id,
                lessonId,
            },
        },
    });

    return progress;
}

// Get all lesson progress for a course
export async function getCourseLessonProgress(courseId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    const progress = await prisma.lessonProgress.findMany({
        where: {
            userId: session.user.id,
            lesson: {
                section: {
                    courseId,
                },
            },
        },
    });

    return progress;
}

// Get continue learning courses with completed lessons count
export async function getContinueLearning(limit = 4) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            course: {
                include: { category: true },
            },
        },
        orderBy: { lastAccessAt: "desc" },
        take: limit,
    });

    // Get completed lessons count for each enrollment
    const enrollmentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
            const completedLessons = await prisma.lessonProgress.count({
                where: {
                    userId: session.user.id,
                    isCompleted: true,
                    lesson: { section: { courseId: enrollment.courseId } },
                },
            });

            return {
                ...enrollment,
                completedLessons,
            };
        }),
    );

    return enrollmentsWithProgress;
}

// Get completed courses
export async function getCompletedCourses(): Promise<EnrollmentWithCourse[]> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: session.user.id,
            completedAt: { not: null },
        },
        include: {
            course: {
                include: { category: true },
            },
        },
        orderBy: { completedAt: "desc" },
    });

    return enrollments;
}
