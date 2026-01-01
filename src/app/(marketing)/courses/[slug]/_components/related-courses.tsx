// ============================================
// Related Courses Component
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/types";

interface RelatedCoursesProps {
  categoryId: string;
  currentCourseId: string;
}

// Mock related courses
const mockRelatedCourses: Course[] = [
  {
    id: "3",
    title: "Advanced React & Next.js Masterclass",
    slug: "advanced-react-nextjs-masterclass",
    description:
      "Build production-ready applications with React 19 & Next.js 16",
    shortDescription:
      "Take your React skills to the next level with advanced patterns and Next.js.",
    thumbnail: "https://picsum.photos/seed/react/800/450",
    price: 149.99,
    discountPrice: 79.99,
    level: "advanced",
    category: {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      coursesCount: 15,
    },
    categoryId: "1",
    instructor: "Michael Chen",
    duration: 2400,
    lessonsCount: 180,
    studentsCount: 8920,
    rating: 4.9,
    reviewsCount: 1560,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "4",
    title: "Node.js Backend Development",
    slug: "nodejs-backend-development",
    description: "Master Node.js, Express, and build RESTful APIs",
    shortDescription:
      "Build scalable backend applications with Node.js and Express.",
    thumbnail: "https://picsum.photos/seed/nodejs/800/450",
    price: 99.99,
    level: "intermediate",
    category: {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      coursesCount: 15,
    },
    categoryId: "1",
    instructor: "Alex Johnson",
    duration: 1800,
    lessonsCount: 140,
    studentsCount: 5420,
    rating: 4.7,
    reviewsCount: 890,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "5",
    title: "TypeScript Complete Guide",
    slug: "typescript-complete-guide",
    description: "Master TypeScript from basics to advanced",
    shortDescription:
      "Learn TypeScript and write type-safe JavaScript applications.",
    thumbnail: "https://picsum.photos/seed/typescript/800/450",
    price: 79.99,
    level: "intermediate",
    category: {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      coursesCount: 15,
    },
    categoryId: "1",
    instructor: "Sarah Williams",
    duration: 1200,
    lessonsCount: 100,
    studentsCount: 4120,
    rating: 4.8,
    reviewsCount: 720,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
];

export function RelatedCourses({
  categoryId,
  currentCourseId,
}: RelatedCoursesProps) {
  // Filter out current course and get related courses
  const courses = mockRelatedCourses.filter(
    (c) => c.categoryId === categoryId && c.id !== currentCourseId,
  );

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
          <Link href={`/courses?category=${categoryId}`}>
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
