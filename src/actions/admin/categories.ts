"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function getAdminCategories(options?: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    await checkAdminAccess();

    const { search, page = 1, limit = 10 } = options || {};

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: { courses: true },
                },
            },
            orderBy: { name: "asc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.category.count({ where }),
    ]);

    return {
        categories: categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            coursesCount: cat._count.courses,
            createdAt: cat.createdAt,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
}) {
    await checkAdminAccess();

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
        where: { slug: data.slug },
    });

    if (existing) {
        throw new Error("A category with this slug already exists");
    }

    const category = await prisma.category.create({
        data,
    });

    revalidatePath("/dashboard/categories");
    return category;
}

export async function updateCategory(
    categoryId: string,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        icon?: string;
    },
) {
    await checkAdminAccess();

    // Check if new slug conflicts
    if (data.slug) {
        const existing = await prisma.category.findFirst({
            where: {
                slug: data.slug,
                id: { not: categoryId },
            },
        });

        if (existing) {
            throw new Error("A category with this slug already exists");
        }
    }

    const category = await prisma.category.update({
        where: { id: categoryId },
        data,
    });

    revalidatePath("/dashboard/categories");
    return category;
}

export async function deleteCategory(categoryId: string) {
    await checkAdminAccess();

    // Check if category has courses
    const coursesCount = await prisma.course.count({
        where: { categoryId },
    });

    if (coursesCount > 0) {
        throw new Error(
            "Cannot delete category with courses. Move or delete the courses first.",
        );
    }

    await prisma.category.delete({
        where: { id: categoryId },
    });

    revalidatePath("/dashboard/categories");
}
