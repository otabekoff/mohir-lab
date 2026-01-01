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
    duration: 4200,
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
    duration: 3600,
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
    title: "Mobile App Development with React Native",
    slug: "mobile-app-development-react-native",
    description: "Build iOS and Android apps with React Native",
    shortDescription:
      "Create cross-platform mobile applications with React Native and Expo.",
    thumbnail: "https://picsum.photos/seed/mobile/800/450",
    price: 119.99,
    level: "intermediate",
    category: {
      id: "3",
      name: "Mobile Development",
      slug: "mobile-development",
      coursesCount: 8,
    },
    categoryId: "3",
    instructor: "Emily Zhang",
    duration: 2800,
    lessonsCount: 200,
    studentsCount: 6540,
    rating: 4.7,
    reviewsCount: 980,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "5",
    title: "UI/UX Design Fundamentals",
    slug: "ui-ux-design-fundamentals",
    description: "Learn design principles, Figma, and user experience",
    shortDescription:
      "Master the fundamentals of UI/UX design and create beautiful interfaces.",
    thumbnail: "https://picsum.photos/seed/design/800/450",
    price: 89.99,
    level: "beginner",
    category: {
      id: "5",
      name: "UI/UX Design",
      slug: "ui-ux-design",
      coursesCount: 6,
    },
    categoryId: "5",
    instructor: "Jessica Lee",
    duration: 1800,
    lessonsCount: 120,
    studentsCount: 4230,
    rating: 4.8,
    reviewsCount: 720,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "6",
    title: "DevOps & Cloud Engineering",
    slug: "devops-cloud-engineering",
    description: "Master Docker, Kubernetes, AWS, and CI/CD",
    shortDescription:
      "Learn modern DevOps practices and cloud infrastructure management.",
    thumbnail: "https://picsum.photos/seed/devops/800/450",
    price: 159.99,
    level: "advanced",
    category: {
      id: "7",
      name: "Cloud Computing",
      slug: "cloud-computing",
      coursesCount: 7,
    },
    categoryId: "7",
    instructor: "David Kumar",
    duration: 3200,
    lessonsCount: 240,
    studentsCount: 5120,
    rating: 4.9,
    reviewsCount: 890,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
];

interface CoursesGridProps {
  category?: string;
  level?: string;
  search?: string;
  sort?: string;
  page: number;
}

export function CoursesGrid({
  category,
  level,
  search,
  sort = "popular",
  page,
}: CoursesGridProps) {
  // In production, this would fetch from API with filters
  let courses = mockCourses;

  // Apply filters (mock implementation)
  if (category) {
    courses = courses.filter((c) => c.category.slug === category);
  }
  if (level) {
    courses = courses.filter((c) => c.level === level);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower),
    );
  }

  // Apply sorting
  if (sort === "newest") {
    courses = [...courses].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  } else if (sort === "price-low") {
    courses = [...courses].sort(
      (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
    );
  } else if (sort === "price-high") {
    courses = [...courses].sort(
      (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
    );
  } else if (sort === "rating") {
    courses = [...courses].sort((a, b) => b.rating - a.rating);
  } else {
    // Default: popular (by students count)
    courses = [...courses].sort((a, b) => b.studentsCount - a.studentsCount);
  }

  // Pagination
  const pageSize = 12;
  const totalPages = Math.ceil(courses.length / pageSize);
  const paginatedCourses = courses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  if (paginatedCourses.length === 0) {
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
          Showing {paginatedCourses.length} of {courses.length} courses
        </p>
        <CoursesSort currentSort={sort} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {totalPages > 1 && (
        <CoursesPagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
