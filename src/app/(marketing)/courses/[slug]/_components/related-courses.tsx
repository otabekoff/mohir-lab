// ============================================
// Related Courses Component
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { ArrowRight } from "lucide-react";
import { getRelatedCourses } from "@/actions/courses";

interface RelatedCoursesProps {
  courseId: string;
  categoryId: string;
}

export async function RelatedCourses({
  courseId,
  categoryId,
}: RelatedCoursesProps) {
  const dbCourses = await getRelatedCourses(courseId, categoryId, 3);

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

  if (courses.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Related Courses</h2>
          <p className="mt-1 text-muted-foreground">
            Students also enrolled in these courses
          </p>
        </div>
        <Button variant="outline" asChild className="hidden gap-2 sm:flex">
          <Link href={`/courses?category=${courses[0]?.category.slug || ""}`}>
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
