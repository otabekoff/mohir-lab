"use client";

// ============================================
// Learning Sidebar Component
// ============================================

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { LessonTypeIcon } from "@/components/lessons";
import { LessonType } from "@/types";

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  order: number;
  isFree: boolean;
}

interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
}

interface Enrollment {
  id: string;
  progress: number;
}

interface Course {
  id: string;
  slug: string;
  sections: Section[];
}

interface LearningSidebarProps {
  course: Course;
  currentLessonId?: string;
  enrollment: Enrollment | null;
  lessonProgress?: LessonProgress[];
}

export function LearningSidebar({
  course,
  currentLessonId,
  enrollment,
  lessonProgress = [],
}: LearningSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(
    course.sections.map((s) => s.id),
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId: string) => {
    return lessonProgress.some(
      (lp) => lp.lessonId === lessonId && lp.isCompleted,
    );
  };

  // Calculate total lessons and completed
  const totalLessons = course.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0,
  );
  const completedLessons = lessonProgress.filter((lp) => lp.isCompleted).length;

  return (
    <aside className="hidden w-80 shrink-0 border-l bg-muted/30 lg:block">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="font-semibold">Course Content</h2>
        <span className="text-xs text-muted-foreground">
          {completedLessons}/{totalLessons} completed
        </span>
      </div>

      <ScrollArea className="h-[calc(100vh-7rem)]">
        <div className="p-2">
          {course.sections.map((section, sectionIndex) => (
            <Collapsible
              key={section.id}
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="mb-1 h-auto w-full justify-start px-2 py-3"
                >
                  <div className="flex w-full items-center gap-2">
                    {openSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">
                        Section {sectionIndex + 1}: {section.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {section.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-4 space-y-1 border-l pl-2">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = isLessonCompleted(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${course.slug}?lesson=${lesson.id}`}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                          isCompleted && !isActive && "text-muted-foreground",
                        )}
                      >
                        <div className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <LessonTypeIcon
                              type={lesson.type || "video"}
                              className={cn(
                                isActive
                                  ? "text-primary-foreground"
                                  : "opacity-70",
                              )}
                              size={16}
                            />
                          )}
                        </div>
                        <div className="flex-1 truncate">{lesson.title}</div>
                        {lesson.duration > 0 && (
                          <div className="flex shrink-0 items-center gap-1 text-xs opacity-70">
                            <Clock className="h-3 w-3" />
                            {formatDuration(lesson.duration)}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
