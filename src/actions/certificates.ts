// ============================================
// Certificates Server Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";

// Get user's certificates
export async function getUserCertificates() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const certificates = await prisma.certificate.findMany({
        where: { userId: session.user.id },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    thumbnail: true,
                    instructor: true,
                    category: {
                        select: { name: true },
                    },
                },
            },
        },
        orderBy: { issuedAt: "desc" },
    });

    return certificates;
}

// Get single certificate by ID
export async function getCertificateById(certificateId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const certificate = await prisma.certificate.findFirst({
        where: {
            id: certificateId,
            userId: session.user.id,
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    thumbnail: true,
                    instructor: true,
                    duration: true,
                    lessonsCount: true,
                    category: {
                        select: { name: true },
                    },
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return certificate;
}

// Get certificate by certificate ID (public)
export async function getCertificateByCertificateId(certId: string) {
    const certificate = await prisma.certificate.findUnique({
        where: { certificateId: certId },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    instructor: true,
                    duration: true,
                    lessonsCount: true,
                    category: {
                        select: { name: true },
                    },
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return certificate;
}

// Issue certificate when course is completed
export async function issueCertificate(courseId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    // Check if user has completed the course
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId,
            },
        },
    });

    if (!enrollment) {
        throw new Error("Not enrolled in this course");
    }

    if (!enrollment.completedAt) {
        throw new Error("Course not completed yet");
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId,
            },
        },
    });

    if (existingCertificate) {
        return existingCertificate;
    }

    // Generate certificate ID
    const certId = `MOHIR-${Date.now().toString(36).toUpperCase()}-${
        session.user.id.slice(-4).toUpperCase()
    }`;

    const certificate = await prisma.certificate.create({
        data: {
            userId: session.user.id,
            courseId,
            certificateId: certId,
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    });

    return certificate;
}

// Get certificate count for a course
export async function getCourseCertificateCount(courseId: string) {
    const count = await prisma.certificate.count({
        where: { courseId },
    });

    return count;
}
