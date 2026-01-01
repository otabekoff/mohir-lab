"use client";

// ============================================
// Course Curriculum Component
// ============================================

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Lock } from "lucide-react";
import type { CourseSection } from "@/types";

interface CourseCurriculumProps {
  sections: CourseSection[];
}

export function CourseCurriculum({ sections }: CourseCurriculumProps) {
  const [expandAll, setExpandAll] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([
    sections[0]?.id || "",
  ]);

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDuration = sections.reduce(
    (acc, s) => acc + s.lessons.reduce((a, l) => a + l.duration, 0),
    0,
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenSections([]);
    } else {
      setOpenSections(sections.map((s) => s.id));
    }
    setExpandAll(!expandAll);
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Content</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {sections.length} sections • {totalLessons} lessons •{" "}
            {formatTotalDuration(totalDuration)} total length
          </p>
        </div>
        <Button variant="ghost" onClick={handleExpandAll}>
          {expandAll ? "Collapse all" : "Expand all"}
        </Button>
      </div>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="rounded-lg border"
      >
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border-b last:border-b-0"
          >
            <AccordionTrigger className="px-4 hover:bg-muted/50 hover:no-underline">
              <div className="flex flex-col items-start gap-1 text-left">
                <span className="font-semibold">{section.title}</span>
                <span className="text-xs text-muted-foreground">
                  {section.lessons.length} lessons •{" "}
                  {formatTotalDuration(
                    section.lessons.reduce((a, l) => a + l.duration, 0),
                  )}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <ul className="divide-y">
                {section.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    {lesson.isFree ? (
                      <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{lesson.title}</p>
                    </div>
                    {lesson.isFree && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        Preview
                      </Badge>
                    )}
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDuration(lesson.duration)}
                    </span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
