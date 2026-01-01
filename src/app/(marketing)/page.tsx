// ============================================
// Landing Page - Home
// ============================================

import { Suspense } from "react";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { FeaturedCoursesSection } from "./_components/featured-courses-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { StatsSection } from "./_components/stats-section";
import { CTASection } from "./_components/cta-section";
import { CategoriesSection } from "./_components/categories-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <Suspense fallback={<CoursesSkeleton />}>
        <FeaturedCoursesSection />
      </Suspense>
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

function CoursesSkeleton() {
  return (
    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-100 rounded-lg" />
        ))}
      </div>
    </section>
  );
}
