"use client";

// ============================================
// Learning Header Component
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Menu } from "lucide-react";

interface LearningHeaderProps {
  course: {
    title: string;
    slug: string;
  };
  progress: number;
}

export function LearningHeader({ course, progress }: LearningHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/courses/${course.slug}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="hidden md:block">
          <h1 className="line-clamp-1 text-sm font-medium">{course.title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
          <Progress value={progress} className="h-2 w-32" />
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
