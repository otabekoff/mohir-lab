"use client";

import {
  Lesson,
  LessonProgress,
  LessonSubmission,
  QuizQuestion,
  LessonResource,
} from "@/types";
import { VideoLesson } from "./video-lesson";
import { TextLesson } from "./text-lesson";
import { QuizLesson } from "./quiz-lesson";
import { AssignmentLesson } from "./assignment-lesson";
import { CodingLesson } from "./coding-lesson";
import {
  TaskLesson,
  MilestoneLesson,
  ExternalLesson,
  LiveLesson,
  ResourceLesson,
  AnnouncementLesson,
  SurveyLesson,
  CertificateLesson,
} from "./lesson-types";
import { LessonTypeBadge } from "./lesson-type-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LessonRendererProps {
  lesson: Lesson;
  progress?: LessonProgress | null;
  submission?: LessonSubmission | null;
  questions?: QuizQuestion[];
  resources?: LessonResource[];

  // Callbacks
  onComplete?: () => void;
  onProgress?: (seconds: number) => void;
  onQuizSubmit?: (score: number, passed: boolean) => void;
  onAssignmentSubmit?: (data: {
    textContent?: string;
    files?: File[];
  }) => Promise<void>;
  onCodeSubmit?: (code: string) => Promise<{
    passed: boolean;
    output: string;
    testResults: Array<{ name: string; passed: boolean; message?: string }>;
  }>;
  onSurveySubmit?: (responses: Record<string, string>) => void;

  // Certificate specific
  certificateUrl?: string;
  courseName?: string;
  studentName?: string;
  canClaimCertificate?: boolean;
  onClaimCertificate?: () => void;

  // Milestone specific
  requiredLessonsCompleted?: boolean;
  milestoneCompletedCount?: number;
  milestoneTotalRequired?: number;
  onMilestoneContinue?: () => void;
}

export function LessonRenderer({
  lesson,
  progress,
  submission,
  questions = [],
  resources = [],
  onComplete,
  onProgress,
  onQuizSubmit,
  onAssignmentSubmit,
  onCodeSubmit,
  onSurveySubmit,
  certificateUrl,
  courseName = "",
  studentName = "",
  canClaimCertificate = false,
  onClaimCertificate,
  requiredLessonsCompleted = false,
  milestoneCompletedCount = 0,
  milestoneTotalRequired = 0,
  onMilestoneContinue,
}: LessonRendererProps) {
  const isCompleted = progress?.isCompleted || false;

  const renderLesson = () => {
    switch (lesson.type) {
      case "video":
        return (
          <VideoLesson
            lesson={lesson}
            onComplete={onComplete}
            onProgress={onProgress}
            initialProgress={progress?.watchedSeconds || 0}
          />
        );

      case "text":
        return (
          <TextLesson
            lesson={lesson}
            onComplete={onComplete}
            isCompleted={isCompleted}
          />
        );

      case "quiz":
      case "exam":
        return (
          <QuizLesson
            lesson={lesson}
            questions={questions}
            onComplete={onQuizSubmit}
            previousAttempts={progress?.quizAttempts || 0}
            bestScore={progress?.quizScore ?? undefined}
          />
        );

      case "assignment":
      case "project":
        return (
          <AssignmentLesson
            lesson={lesson}
            submission={submission}
            onSubmit={onAssignmentSubmit}
          />
        );

      case "coding":
        return (
          <CodingLesson
            lesson={lesson}
            onSubmit={onCodeSubmit}
            onComplete={onComplete}
            savedCode={submission?.codeContent}
          />
        );

      case "task":
        return (
          <TaskLesson
            lesson={lesson}
            onComplete={onComplete}
            isCompleted={isCompleted}
          />
        );

      case "milestone":
        return (
          <MilestoneLesson
            lesson={lesson}
            requiredLessonsCompleted={requiredLessonsCompleted}
            completedCount={milestoneCompletedCount}
            totalRequired={milestoneTotalRequired}
            onContinue={onMilestoneContinue}
          />
        );

      case "external":
        return (
          <ExternalLesson
            lesson={lesson}
            onComplete={onComplete}
            isCompleted={isCompleted}
          />
        );

      case "live":
        return <LiveLesson lesson={lesson} />;

      case "resource":
        return (
          <ResourceLesson
            lesson={lesson}
            resources={resources}
            onComplete={onComplete}
            isCompleted={isCompleted}
          />
        );

      case "announcement":
        return (
          <AnnouncementLesson
            lesson={lesson}
            onComplete={onComplete}
            isCompleted={isCompleted}
          />
        );

      case "survey":
        return (
          <SurveyLesson
            lesson={lesson}
            onSubmit={onSurveySubmit}
            isCompleted={isCompleted}
          />
        );

      case "certificate":
        return (
          <CertificateLesson
            lesson={lesson}
            certificateUrl={certificateUrl}
            courseName={courseName}
            studentName={studentName}
            completedDate={progress?.completedAt ?? undefined}
            canClaim={canClaimCertificate}
            onClaim={onClaimCertificate}
          />
        );

      case "discussion":
        // Discussion would need a separate comment component
        return (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Discussion feature coming soon
              </p>
            </CardContent>
          </Card>
        );

      case "group_work":
        return (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Group work feature coming soon
              </p>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Unknown lesson type: {lesson.type}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Lesson header */}
      <div className="flex items-center gap-3">
        <LessonTypeBadge type={lesson.type} />
        {lesson.duration > 0 && lesson.type === "video" && (
          <span className="text-sm text-muted-foreground">
            {Math.floor(lesson.duration / 60)} min
          </span>
        )}
      </div>

      {/* Lesson content */}
      {renderLesson()}

      {/* Resources (for applicable lesson types) */}
      {resources.length > 0 && !["resource"].includes(lesson.type) && (
        <>
          <Separator className="my-6" />
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Lesson Resources</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                >
                  <span className="text-muted-foreground">
                    {resource.type === "pdf" && "📄"}
                    {resource.type === "code" && "💻"}
                    {resource.type === "slides" && "📊"}
                    {resource.type === "link" && "🔗"}
                    {!["pdf", "code", "slides", "link"].includes(
                      resource.type,
                    ) && "📎"}
                  </span>
                  <span>{resource.title}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
