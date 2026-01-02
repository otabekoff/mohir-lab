// ============================================
// Featured Courses Section
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { ArrowRight } from "lucide-react";
import { getFeaturedCourses } from "@/actions/courses";

export async function FeaturedCoursesSection() {
  const dbCourses = await getFeaturedCourses(6);

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

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="container py-16 md:py-24">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Courses
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Start learning with our most popular courses
          </p>
        </div>
        <Button variant="outline" asChild className="hidden gap-2 sm:flex">
          <Link href="/courses">
            View All Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Button asChild>
          <Link href="/courses">View All Courses</Link>
        </Button>
      </div>
    </section>
  );
}
