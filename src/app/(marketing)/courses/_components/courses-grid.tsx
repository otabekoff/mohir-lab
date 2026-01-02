// ============================================
// Courses Grid Component
// ============================================

import { CourseCard } from "@/components/courses/course-card";
import { CoursesSort } from "./courses-sort";
import { CoursesPagination } from "./courses-pagination";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { SearchX } from "lucide-react";
import { getCourses } from "@/actions/courses";
import { CourseLevel } from "@/generated/prisma";

interface CoursesGridProps {
  category?: string;
  level?: string;
  search?: string;
  sort?: string;
  page: number;
}

export async function CoursesGrid({
  category,
  level,
  search,
  sort = "popular",
  page,
}: CoursesGridProps) {
  const pageSize = 12;

  // Fetch courses from database
  const { courses: dbCourses, total } = await getCourses({
    category,
    level: level as CourseLevel | undefined,
    search,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  // Transform database courses to frontend Course type
  const courses = dbCourses.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.shortDescription,
    thumbnail: course.thumbnail || "/placeholder-course.jpg",
    price: Number(course.price),
    discountPrice: course.discountPrice
      ? Number(course.discountPrice)
      : undefined,
    level: course.level as
      | "beginner"
      | "intermediate"
      | "advanced"
      | "all_levels",
    category: {
      id: course.category.id,
      name: course.category.name,
      slug: course.category.slug,
      coursesCount: 0,
    },
    categoryId: course.categoryId,
    instructor: course.instructor,
    duration: course.duration,
    lessonsCount: course.lessonsCount,
    studentsCount: course.studentsCount,
    rating: course.rating,
    reviewsCount: course.reviewsCount,
    isPublished: course.isPublished,
    isFeatured: course.isFeatured,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    sections: [],
  }));

  const totalPages = Math.ceil(total / pageSize);

  if (courses.length === 0) {
    return (
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX className="size-5" />
          </EmptyMedia>
          <EmptyTitle>No courses found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters or search query
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {courses.length} of {total} courses
        </p>
        <CoursesSort currentSort={sort} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {totalPages > 1 && (
        <CoursesPagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
