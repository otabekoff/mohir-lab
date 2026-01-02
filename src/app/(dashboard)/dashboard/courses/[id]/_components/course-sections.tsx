"use client";

// ============================================
// Course Sections Manager Component
// ============================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Play,
  Clock,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  sections: Section[];
}

interface CourseSectionsProps {
  course: Course;
}

export function CourseSections({ course }: CourseSectionsProps) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Content</CardTitle>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent>
          {course.sections.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No sections yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add sections to organize your course content
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {course.sections.map((section, sectionIndex) => (
                <Collapsible
                  key={section.id}
                  open={openSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                  className="rounded-lg border"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-2 p-4 hover:bg-muted/50">
                      <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                      {openSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium">
                          Section {sectionIndex + 1}: {section.title}
                        </span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({section.lessons.length} lessons)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t px-4 py-2">
                      {section.lessons.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          No lessons in this section
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50"
                            >
                              <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                              <Play className="h-4 w-4 text-muted-foreground" />
                              <span className="flex-1">
                                {sectionIndex + 1}.{lessonIndex + 1}{" "}
                                {lesson.title}
                              </span>
                              {lesson.isFree && (
                                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                  Free
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDuration(lesson.duration)}
                              </span>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        className="mt-2 w-full gap-2"
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                        Add Lesson
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
