// ============================================
// Course Header Component
// ============================================

import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, BookOpen, Award } from "lucide-react";
import type { Course } from "@/types";

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <section className="border-b bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">{course.category.name}</Badge>
            <Badge variant="outline" className="capitalize">
              {course.level.replace("-", " ")}
            </Badge>
            {course.isFeatured && <Badge>Featured</Badge>}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {course.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            {course.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{course.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({course.reviewsCount.toLocaleString()} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{course.studentsCount.toLocaleString()} students</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(course.duration)} total</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{course.lessonsCount} lessons</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>Certificate included</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Created by{" "}
            <span className="font-medium text-foreground">
              {course.instructor}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
