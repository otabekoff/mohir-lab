"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CheckCircle, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Lesson } from "@/types";

interface TextLessonProps {
  lesson: Lesson;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function TextLesson({
  lesson,
  onComplete,
  isCompleted,
}: TextLessonProps) {
  const [readProgress, setReadProgress] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("lesson-content");
      if (!element) return;

      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadProgress(Math.min(100, Math.round(scrollPercentage)));

      if (scrollPercentage >= 90) {
        setHasReachedEnd(true);
      }
    };

    const element = document.getElementById("lesson-content");
    element?.addEventListener("scroll", handleScroll);
    return () => element?.removeEventListener("scroll", handleScroll);
  }, []);

  const estimatedReadTime = lesson.content
    ? Math.ceil(lesson.content.split(/\s+/).length / 200)
    : 1;

  if (!lesson.content) {
    return (
      <div className="flex min-h-100 items-center justify-center rounded-lg border bg-muted/50">
        <p className="text-muted-foreground">Content not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Article</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{estimatedReadTime} min read</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32">
            <Progress value={readProgress} className="h-2" />
          </div>
          <span className="text-xs text-muted-foreground">{readProgress}%</span>
        </div>
      </div>

      {/* Content */}
      <div
        id="lesson-content"
        className="prose max-w-none overflow-y-auto rounded-lg border bg-card p-6 prose-neutral lg:p-8 dark:prose-invert"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre: ({ children, ...props }) => (
              <pre
                className="overflow-x-auto rounded-lg bg-muted p-4"
                {...props}
              >
                {children}
              </pre>
            ),
            code: ({ children, className, ...props }) => {
              const isInline = !className;
              return (
                <code
                  className={cn(
                    isInline && "rounded bg-muted px-1.5 py-0.5",
                    className,
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            a: ({ children, href, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                {...props}
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <Image
                src={typeof src === "string" ? src : ""}
                alt={alt || ""}
                width={800}
                height={400}
                className="rounded-lg"
                loading="lazy"
                unoptimized
              />
            ),
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </div>

      {/* Complete button */}
      {!isCompleted && hasReachedEnd && (
        <div className="flex justify-center">
          <Button onClick={onComplete} className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Mark as Complete
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Lesson Completed</span>
        </div>
      )}
    </div>
  );
}
