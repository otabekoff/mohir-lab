"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { CourseLevel } from "@/generated/prisma";
import { AuthorizationError, withDatabase } from "@/lib/db-errors";

// Helper to check admin access
async function checkAdminAccess() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthorizationError("You must be logged in to access this resource.");
  }

  return await withDatabase(async () => {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || !["owner", "manager"].includes(user.role)) {
      throw new AuthorizationError("You do not have permission to access this resource.");
    }

    return { userId: session.user.id, role: user.role };
  }, 'checkAdminAccess');
}

export async function getAdminCourses(options?: {
  search?: string;
  published?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  await checkAdminAccess();

  return await withDatabase(async () => {
    const search = options?.search;
    const published = options?.published;
    const categoryId = options?.categoryId;
    const page = options?.page || 1;
    const limit = options?.limit || 10;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (published === "published") {
      where.isPublished = true;
    } else if (published === "draft") {
      where.isPublished = false;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          _count: {
            select: { enrollments: true, reviews: true, sections: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    return {
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        price: Number(course.price),
        discountPrice: course.discountPrice ? Number(course.discountPrice) : null,
        isPublished: course.isPublished,
        isFeatured: course.isFeatured,
        category: course.category,
        studentsCount: course.studentsCount,
        rating: course.rating,
        reviewsCount: course._count.reviews,
        sectionsCount: course._count.sections,
        createdAt: course.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }, 'getAdminCourses');
}

export async function getAdminCourseById(courseId: string) {
  await checkAdminAccess();

  return await withDatabase(async () => {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        sections: {
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
    });

    if (!course) return null;

    return {
      ...course,
      price: Number(course.price),
      discountPrice: course.discountPrice ? Number(course.discountPrice) : null,
    };
  }, 'getAdminCourseById');
}

export async function createCourse(data: {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail?: string;
  previewVideo?: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  level: CourseLevel;
  instructor: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}) {
  await checkAdminAccess();

  return await withDatabase(async () => {
    const existingSlug = await prisma.course.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new Error("A course with this slug already exists");
    }

    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail,
        previewVideo: data.previewVideo,
        price: data.price,
        discountPrice: data.discountPrice,
        categoryId: data.categoryId,
        level: data.level,
        instructor: data.instructor,
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
      },
    });

    revalidatePath("/dashboard/courses");

    return course;
  }, 'createCourse');
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    thumbnail?: string;
    previewVideo?: string;
    price?: number;
    discountPrice?: number | null;
    categoryId?: string;
    level?: CourseLevel;
    instructor?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
  }
) {
  await checkAdminAccess();

  return await withDatabase(async () => {
    if (data.slug) {
      const existingSlug = await prisma.course.findFirst({
        where: { slug: data.slug, NOT: { id: courseId } },
      });

      if (existingSlug) {
        throw new Error("A course with this slug already exists");
      }
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data,
    });

    revalidatePath("/dashboard/courses");
    revalidatePath(`/dashboard/courses/${courseId}`);

    return course;
  }, 'updateCourse');
}

export async function deleteCourse(courseId: string) {
  await checkAdminAccess();

  return await withDatabase(async () => {
    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/dashboard/courses");

    return { success: true };
  }, 'deleteCourse');
}

export async function duplicateCourse(courseId: string) {
  await checkAdminAccess();

  const original = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: { lessons: true },
      },
    },
  });

  if (!original) throw new Error("Course not found");

  const newSlug = `${original.slug}-copy-${Date.now()}`;

  const newCourse = await prisma.course.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: newSlug,
      shortDescription: original.shortDescription,
      description: original.description,
      thumbnail: original.thumbnail,
      previewVideo: original.previewVideo,
      price: original.price,
      discountPrice: original.discountPrice,
      categoryId: original.categoryId,
      level: original.level,
      instructor: original.instructor,
      isPublished: false,
      isFeatured: false,
    },
  });

  for (const section of original.sections) {
    const newSection = await prisma.section.create({
      data: {
        courseId: newCourse.id,
        title: section.title,
        order: section.order,
      },
    });

    for (const lesson of section.lessons) {
      await prisma.lesson.create({
        data: {
          sectionId: newSection.id,
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          isFree: lesson.isFree,
          order: lesson.order,
        },
      });
    }
  }

  revalidatePath("/dashboard/courses");

  return newCourse;
}

// Section management
export async function createSection(courseId: string, title: string) {
  await checkAdminAccess();

  return await withDatabase(async () => {
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });

    const section = await prisma.section.create({
      data: {
        courseId,
        title,
        order: (lastSection?.order || 0) + 1,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return section;
  }, 'createSection');
}

export async function updateSection(sectionId: string, title: string) {
  await checkAdminAccess();

  const section = await prisma.section.update({
    where: { id: sectionId },
    data: { title },
  });

  const course = await prisma.course.findFirst({
    where: { sections: { some: { id: sectionId } } },
  });

  if (course) {
    revalidatePath(`/dashboard/courses/${course.id}`);
  }

  return section;
}

export async function deleteSection(sectionId: string) {
  await checkAdminAccess();

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { courseId: true },
  });

  await prisma.section.delete({
    where: { id: sectionId },
  });

  if (section) {
    revalidatePath(`/dashboard/courses/${section.courseId}`);
  }

  return { success: true };
}

// Lesson management
export async function createLesson(
  sectionId: string,
  data: {
    title: string;
    description?: string;
    videoUrl: string;
    duration?: number;
    isFree?: boolean;
  }
) {
  await checkAdminAccess();

  const lastLesson = await prisma.lesson.findFirst({
    where: { sectionId },
    orderBy: { order: "desc" },
  });

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { courseId: true },
  });

  const lesson = await prisma.lesson.create({
    data: {
      sectionId,
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      duration: data.duration || 0,
      isFree: data.isFree || false,
      order: (lastLesson?.order || 0) + 1,
    },
  });

  if (section) {
    revalidatePath(`/dashboard/courses/${section.courseId}`);
  }

  return lesson;
}

export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
    isFree?: boolean;
  }
) {
  await checkAdminAccess();

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data,
    include: {
      section: { select: { courseId: true } },
    },
  });

  revalidatePath(`/dashboard/courses/${lesson.section.courseId}`);

  return lesson;
}

export async function deleteLesson(lessonId: string) {
  await checkAdminAccess();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: { select: { courseId: true } },
    },
  });

  await prisma.lesson.delete({
    where: { id: lessonId },
  });

  if (lesson) {
    revalidatePath(`/dashboard/courses/${lesson.section.courseId}`);
  }

  return { success: true };
}
