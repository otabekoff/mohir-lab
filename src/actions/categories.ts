// ============================================
// Category Server Actions
// ============================================

"use server";

import prisma from "@/lib/prisma";
import { type Prisma } from "@/generated/prisma";

export type CategoryWithCount = Prisma.CategoryGetPayload<{
    include: {
        _count: {
            select: { courses: true };
        };
    };
}>;

// Get all categories
export async function getCategories(): Promise<CategoryWithCount[]> {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { courses: { where: { isPublished: true } } },
            },
        },
        orderBy: { name: "asc" },
    });

    return categories;
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            _count: {
                select: { courses: { where: { isPublished: true } } },
            },
        },
    });

    return category;
}

// Get categories with their published course counts
export async function getCategoriesWithCounts() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { courses: { where: { isPublished: true } } },
            },
            courses: {
                where: { isPublished: true },
                select: { studentsCount: true },
            },
        },
        orderBy: { name: "asc" },
    });

    return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        courseCount: cat._count.courses,
        studentCount: cat.courses.reduce(
            (sum, course) => sum + course.studentsCount,
            0,
        ),
    }));
}
