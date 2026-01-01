// ============================================
// Featured Courses Section
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/types";

// Mock data - will be replaced with actual API call
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp 2026",
    slug: "complete-web-development-bootcamp-2026",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more",
    shortDescription:
      "Master full-stack web development from scratch with hands-on projects.",
    thumbnail: "https://picsum.photos/seed/webdev/800/450",
    price: 99.99,
    discountPrice: 49.99,
    level: "beginner",
    category: {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      coursesCount: 15,
    },
    categoryId: "1",
    instructor: "Alex Johnson",
    duration: 4200, // 70 hours
    lessonsCount: 320,
    studentsCount: 15420,
    rating: 4.8,
    reviewsCount: 3250,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "2",
    title: "Python for Data Science & Machine Learning",
    slug: "python-data-science-machine-learning",
    description: "Master Python, Pandas, NumPy, Matplotlib, Scikit-learn",
    shortDescription:
      "Become a data scientist with Python. Learn ML algorithms and data analysis.",
    thumbnail: "https://picsum.photos/seed/python/800/450",
    price: 129.99,
    level: "intermediate",
    category: {
      id: "2",
      name: "Data Science",
      slug: "data-science",
      coursesCount: 12,
    },
    categoryId: "2",
    instructor: "Sarah Williams",
    duration: 3600, // 60 hours
    lessonsCount: 280,
    studentsCount: 12350,
    rating: 4.9,
    reviewsCount: 2890,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
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
    duration: 2400, // 40 hours
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
];

export function FeaturedCoursesSection() {
  // In production, this would be a server component fetching from API
  const courses = mockCourses;

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
