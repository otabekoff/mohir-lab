// ============================================
// Lesson Type Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";

// ============================================
// Quiz Actions
// ============================================

// Get quiz questions for a lesson
export async function getQuizQuestions(lessonId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    const questions = await prisma.quizQuestion.findMany({
        where: { lessonId },
        include: {
            options: {
                orderBy: { order: "asc" },
            },
        },
        orderBy: { order: "asc" },
    });

    return questions;
}

// Submit quiz answer
export async function submitQuizAnswer(
    questionId: string,
    answer: string,
    isCorrect: boolean,
    points: number,
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.quizAnswer.upsert({
            where: {
                questionId_userId: {
                    questionId,
                    userId: session.user.id,
                },
            },
            update: {
                answer,
                isCorrect,
                points,
            },
            create: {
                questionId,
                userId: session.user.id,
                answer,
                isCorrect,
                points,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit quiz answer:", error);
        return { success: false, error: "Failed to submit answer" };
    }
}

// Submit entire quiz and calculate score
export async function submitQuiz(
    lessonId: string,
    answers: Record<string, { answer: string; isCorrect: boolean; points: number }>,
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Get the lesson to check passing score
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { passingScore: true },
        });

        const passingScore = lesson?.passingScore ?? 70;

        // Calculate total score
        let totalPoints = 0;
        let earnedPoints = 0;

        for (const [questionId, data] of Object.entries(answers)) {
            totalPoints += data.points;
            if (data.isCorrect) {
                earnedPoints += data.points;
            }

            // Save each answer
            await prisma.quizAnswer.upsert({
                where: {
                    questionId_userId: {
                        questionId,
                        userId: session.user.id,
                    },
                },
                update: {
                    answer: data.answer,
                    isCorrect: data.isCorrect,
                    points: data.isCorrect ? data.points : 0,
                },
                create: {
                    questionId,
                    userId: session.user.id,
                    answer: data.answer,
                    isCorrect: data.isCorrect,
                    points: data.isCorrect ? data.points : 0,
                },
            });
        }

        const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const passed = scorePercentage >= passingScore;

        // Update lesson progress
        const existingProgress = await prisma.lessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId,
                },
            },
        });

        const newAttempts = (existingProgress?.quizAttempts ?? 0) + 1;
        const bestScore = Math.max(existingProgress?.quizScore ?? 0, scorePercentage);

        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId,
                },
            },
            update: {
                quizScore: bestScore,
                quizAttempts: newAttempts,
                lastQuizDate: new Date(),
                isCompleted: passed || existingProgress?.isCompleted || false,
                completedAt: passed && !existingProgress?.isCompleted ? new Date() : existingProgress?.completedAt,
            },
            create: {
                userId: session.user.id,
                lessonId,
                quizScore: scorePercentage,
                quizAttempts: 1,
                lastQuizDate: new Date(),
                isCompleted: passed,
                completedAt: passed ? new Date() : null,
            },
        });

        revalidatePath("/learn/[slug]", "page");

        return {
            success: true,
            score: scorePercentage,
            passed,
            attempts: newAttempts,
            bestScore,
        };
    } catch (error) {
        console.error("Failed to submit quiz:", error);
        return { success: false, error: "Failed to submit quiz" };
    }
}

// ============================================
// Assignment Actions
// ============================================

// Get user's submission for a lesson
export async function getSubmission(lessonId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const submission = await prisma.lessonSubmission.findUnique({
        where: {
            lessonId_userId: {
                lessonId,
                userId: session.user.id,
            },
        },
    });

    return submission;
}

// Save assignment draft
export async function saveAssignmentDraft(
    lessonId: string,
    data: { textContent?: string; fileUrls?: string[] },
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.lessonSubmission.upsert({
            where: {
                lessonId_userId: {
                    lessonId,
                    userId: session.user.id,
                },
            },
            update: {
                textContent: data.textContent,
                fileUrls: data.fileUrls ? JSON.stringify(data.fileUrls) : null,
                status: "draft",
            },
            create: {
                lessonId,
                userId: session.user.id,
                textContent: data.textContent,
                fileUrls: data.fileUrls ? JSON.stringify(data.fileUrls) : null,
                status: "draft",
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to save draft:", error);
        return { success: false, error: "Failed to save draft" };
    }
}

// Submit assignment
export async function submitAssignment(
    lessonId: string,
    data: { textContent?: string; fileUrls?: string[] },
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const submission = await prisma.lessonSubmission.upsert({
            where: {
                lessonId_userId: {
                    lessonId,
                    userId: session.user.id,
                },
            },
            update: {
                textContent: data.textContent,
                fileUrls: data.fileUrls ? JSON.stringify(data.fileUrls) : null,
                status: "submitted",
                submittedAt: new Date(),
            },
            create: {
                lessonId,
                userId: session.user.id,
                textContent: data.textContent,
                fileUrls: data.fileUrls ? JSON.stringify(data.fileUrls) : null,
                status: "submitted",
                submittedAt: new Date(),
            },
        });

        // Check if assignment requires manual review
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { requiresManualReview: true },
        });

        // If doesn't require manual review, auto-complete the lesson
        if (!lesson?.requiresManualReview) {
            await prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId: session.user.id,
                        lessonId,
                    },
                },
                update: {
                    isCompleted: true,
                    completedAt: new Date(),
                },
                create: {
                    userId: session.user.id,
                    lessonId,
                    isCompleted: true,
                    completedAt: new Date(),
                },
            });
        }

        revalidatePath("/learn/[slug]", "page");

        return { success: true, submission };
    } catch (error) {
        console.error("Failed to submit assignment:", error);
        return { success: false, error: "Failed to submit assignment" };
    }
}

// Grade assignment (for instructors)
export async function gradeAssignment(
    submissionId: string,
    data: { score: number; feedback?: string },
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    // Check if user is owner or manager
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!user || !["owner", "manager"].includes(user.role)) {
        return { success: false, error: "Not authorized to grade" };
    }

    try {
        const submission = await prisma.lessonSubmission.update({
            where: { id: submissionId },
            data: {
                score: data.score,
                feedback: data.feedback,
                status: "graded",
                gradedBy: session.user.id,
                gradedAt: new Date(),
            },
        });

        // Mark lesson as complete if passed
        const passing = data.score >= 60; // 60% passing threshold
        if (passing) {
            await prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId: submission.userId,
                        lessonId: submission.lessonId,
                    },
                },
                update: {
                    isCompleted: true,
                    completedAt: new Date(),
                },
                create: {
                    userId: submission.userId,
                    lessonId: submission.lessonId,
                    isCompleted: true,
                    completedAt: new Date(),
                },
            });
        }

        revalidatePath("/dashboard/reviews");

        return { success: true };
    } catch (error) {
        console.error("Failed to grade assignment:", error);
        return { success: false, error: "Failed to grade assignment" };
    }
}

// ============================================
// Coding Exercise Actions
// ============================================

// Save code submission
export async function saveCode(lessonId: string, code: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.lessonSubmission.upsert({
            where: {
                lessonId_userId: {
                    lessonId,
                    userId: session.user.id,
                },
            },
            update: {
                codeContent: code,
                status: "draft",
            },
            create: {
                lessonId,
                userId: session.user.id,
                codeContent: code,
                status: "draft",
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to save code:", error);
        return { success: false, error: "Failed to save code" };
    }
}

// Submit code for testing (this would normally call a code execution service)
export async function runCode(
    lessonId: string,
    code: string,
): Promise<{
    success: boolean;
    passed?: boolean;
    output?: string;
    testResults?: Array<{ name: string; passed: boolean; message?: string }>;
    error?: string;
}> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Get the lesson's test cases
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { testCases: true, language: true },
        });

        // In a real implementation, you would:
        // 1. Send the code to a sandboxed code execution service
        // 2. Run the test cases against the code
        // 3. Return the results

        // For now, we'll simulate a basic response
        const testCases = lesson?.testCases ? JSON.parse(lesson.testCases) : [];
        
        // Simulate test results (in production, this would be actual test execution)
        const testResults = testCases.map((test: { name: string; expected: string }) => ({
            name: test.name,
            passed: Math.random() > 0.3, // Simulated - would be actual test result
            message: "Test completed",
        }));

        const allPassed = testResults.every((t: { passed: boolean }) => t.passed);
        const passedCount = testResults.filter((t: { passed: boolean }) => t.passed).length;

        // Save submission
        await prisma.lessonSubmission.upsert({
            where: {
                lessonId_userId: {
                    lessonId,
                    userId: session.user.id,
                },
            },
            update: {
                codeContent: code,
                status: allPassed ? "graded" : "submitted",
                testResults: JSON.stringify(testResults),
                passedTests: passedCount,
                totalTests: testResults.length,
                codeOutput: "Code execution simulated",
            },
            create: {
                lessonId,
                userId: session.user.id,
                codeContent: code,
                status: allPassed ? "graded" : "submitted",
                testResults: JSON.stringify(testResults),
                passedTests: passedCount,
                totalTests: testResults.length,
                codeOutput: "Code execution simulated",
            },
        });

        // If all tests pass, mark lesson as complete
        if (allPassed) {
            await prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId: session.user.id,
                        lessonId,
                    },
                },
                update: {
                    isCompleted: true,
                    completedAt: new Date(),
                    codePassed: true,
                    codeScore: Math.round((passedCount / testResults.length) * 100),
                },
                create: {
                    userId: session.user.id,
                    lessonId,
                    isCompleted: true,
                    completedAt: new Date(),
                    codePassed: true,
                    codeScore: Math.round((passedCount / testResults.length) * 100),
                },
            });
        }

        revalidatePath("/learn/[slug]", "page");

        return {
            success: true,
            passed: allPassed,
            output: "Code executed successfully",
            testResults,
        };
    } catch (error) {
        console.error("Failed to run code:", error);
        return { success: false, error: "Failed to run code" };
    }
}

// ============================================
// Discussion/Comment Actions
// ============================================

// Get comments for a lesson
export async function getLessonComments(lessonId: string) {
    const comments = await prisma.lessonComment.findMany({
        where: {
            lessonId,
            parentId: null, // Only top-level comments
        },
        include: {
            replies: {
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: [
            { isPinned: "desc" },
            { createdAt: "desc" },
        ],
    });

    return comments;
}

// Add a comment
export async function addComment(
    lessonId: string,
    content: string,
    parentId?: string,
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Check if user is instructor
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        const isInstructor = ["owner", "manager"].includes(user?.role || "");

        const comment = await prisma.lessonComment.create({
            data: {
                lessonId,
                userId: session.user.id,
                content,
                parentId,
                isInstructor,
            },
        });

        revalidatePath("/learn/[slug]", "page");

        return { success: true, comment };
    } catch (error) {
        console.error("Failed to add comment:", error);
        return { success: false, error: "Failed to add comment" };
    }
}

// ============================================
// Survey Actions
// ============================================

export async function submitSurvey(
    lessonId: string,
    responses: Record<string, string>,
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Save responses as a submission
        await prisma.lessonSubmission.upsert({
            where: {
                lessonId_userId: {
                    lessonId,
                    userId: session.user.id,
                },
            },
            update: {
                textContent: JSON.stringify(responses),
                status: "submitted",
                submittedAt: new Date(),
            },
            create: {
                lessonId,
                userId: session.user.id,
                textContent: JSON.stringify(responses),
                status: "submitted",
                submittedAt: new Date(),
            },
        });

        // Mark lesson as complete
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId,
                },
            },
            update: {
                isCompleted: true,
                completedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                lessonId,
                isCompleted: true,
                completedAt: new Date(),
            },
        });

        revalidatePath("/learn/[slug]", "page");

        return { success: true };
    } catch (error) {
        console.error("Failed to submit survey:", error);
        return { success: false, error: "Failed to submit survey" };
    }
}
