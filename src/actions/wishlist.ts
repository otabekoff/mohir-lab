// ============================================
// Wishlist Server Actions
// ============================================

"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";

// Get user's wishlist
export async function getUserWishlist() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    const wishlistItems = await prisma.wishlist.findMany({
        where: { userId: session.user.id },
        include: {
            course: {
                include: { category: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return wishlistItems;
}

// Check if course is in wishlist
export async function isInWishlist(courseId: string): Promise<boolean> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return false;
    }

    const item = await prisma.wishlist.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId,
            },
        },
    });

    return !!item;
}

// Add course to wishlist
export async function addToWishlist(courseId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "You must be logged in" };
    }

    try {
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        if (existing) {
            return { success: false, error: "Already in wishlist" };
        }

        await prisma.wishlist.create({
            data: {
                userId: session.user.id,
                courseId,
            },
        });

        revalidatePath("/courses/[slug]", "page");
        revalidatePath("/wishlist");

        return { success: true };
    } catch (error) {
        console.error("Failed to add to wishlist:", error);
        return { success: false, error: "Failed to add to wishlist" };
    }
}

// Remove course from wishlist
export async function removeFromWishlist(courseId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "You must be logged in" };
    }

    try {
        await prisma.wishlist.delete({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId,
                },
            },
        });

        revalidatePath("/courses/[slug]", "page");
        revalidatePath("/wishlist");

        return { success: true };
    } catch (error) {
        console.error("Failed to remove from wishlist:", error);
        return { success: false, error: "Failed to remove from wishlist" };
    }
}

// Toggle wishlist
export async function toggleWishlist(courseId: string) {
    const inWishlist = await isInWishlist(courseId);
    
    if (inWishlist) {
        return removeFromWishlist(courseId);
    } else {
        return addToWishlist(courseId);
    }
}
