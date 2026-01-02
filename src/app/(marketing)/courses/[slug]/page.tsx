// ============================================
// Course Detail Page
// ============================================

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CourseHeader } from "./_components/course-header";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseCurriculum } from "./_components/course-curriculum";
import { CourseDescription } from "./_components/course-description";
import { CourseReviews } from "./_components/course-reviews";
import { CourseInstructor } from "./_components/course-instructor";
import { RelatedCourses } from "./_components/related-courses";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourseBySlug } from "@/actions/courses";
import type { Course } from "@/types";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const dbCourse = await getCourseBySlug(slug);

  if (!dbCourse) {
    notFound();
  }

  // Transform database course to frontend Course type
  const course: Course = {
    id: dbCourse.id,
    title: dbCourse.title,
    slug: dbCourse.slug,
    description: dbCourse.description,
    shortDescription: dbCourse.shortDescription,
    thumbnail: dbCourse.thumbnail || "/placeholder-course.jpg",
    previewVideo: dbCourse.previewVideo || undefined,
    price: Number(dbCourse.price),
    discountPrice: dbCourse.discountPrice
      ? Number(dbCourse.discountPrice)
      : undefined,
    level: dbCourse.level as Course["level"],
    category: {
      id: dbCourse.category.id,
      name: dbCourse.category.name,
      slug: dbCourse.category.slug,
      coursesCount: 0,
    },
    categoryId: dbCourse.categoryId,
    instructor: dbCourse.instructor,
    duration: dbCourse.duration,
    lessonsCount: dbCourse.lessonsCount,
    studentsCount: dbCourse.studentsCount,
    rating: dbCourse.rating,
    reviewsCount: dbCourse.reviewsCount,
    isPublished: dbCourse.isPublished,
    isFeatured: dbCourse.isFeatured,
    createdAt: dbCourse.createdAt,
    updatedAt: dbCourse.updatedAt,
    sections: dbCourse.sections.map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        videoUrl: lesson.videoUrl || "", // Include videoUrl for free lesson preview
        duration: lesson.duration,
        order: lesson.order,
        isFree: lesson.isFree,
      })),
    })),
  };

  return (
    <div className="min-h-screen">
      <CourseHeader course={course} />

      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            <CourseDescription description={course.description} />
            <CourseCurriculum sections={course.sections} />
            <CourseInstructor instructor={course.instructor} />
            <Suspense fallback={<Skeleton className="h-96" />}>
              <CourseReviews
                courseSlug={course.slug}
                rating={course.rating}
                reviewsCount={course.reviewsCount}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar course={course} />
          </div>
        </div>

        <Suspense fallback={<Skeleton className="mt-12 h-96" />}>
          <RelatedCourses courseId={course.id} categoryId={course.categoryId} />
        </Suspense>
      </div>
    </div>
  );
}
