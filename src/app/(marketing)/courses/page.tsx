// ============================================
// Courses Page
// ============================================

import { Suspense } from "react";
import { CoursesGrid } from "./_components/courses-grid";
import { CoursesFilters } from "./_components/courses-filters";
import { CoursesSkeleton } from "./_components/courses-skeleton";

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    level?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore Courses
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our collection of premium courses and start learning today
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <CoursesFilters
            selectedCategory={params.category}
            selectedLevel={params.level}
          />
        </aside>

        {/* Courses Grid */}
        <main className="flex-1">
          <Suspense fallback={<CoursesSkeleton />}>
            <CoursesGrid
              category={params.category}
              level={params.level}
              search={params.search}
              sort={params.sort}
              page={params.page ? parseInt(params.page) : 1}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
