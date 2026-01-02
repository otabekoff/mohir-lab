"use client";

import { useState } from "react";
import {
  CheckCircle,
  Target,
  Flag,
  Lock,
  ExternalLink,
  Radio,
  Calendar,
  Clock,
  Award,
  Download,
  Megaphone,
  ListChecks,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Lesson, LessonResource } from "@/types";

// ============================================
// Task Lesson - Simple "do and mark complete"
// ============================================

interface TaskLessonProps {
  lesson: Lesson;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function TaskLesson({
  lesson,
  onComplete,
  isCompleted,
}: TaskLessonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-pink-600" />
          {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson.description && (
          <div className="prose max-w-none prose-neutral dark:prose-invert">
            <ReactMarkdown>{lesson.description}</ReactMarkdown>
          </div>
        )}

        {lesson.content && (
          <div className="rounded-lg bg-muted/50 p-4">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        )}

        <Separator />

        {!isCompleted ? (
          <Button onClick={onComplete} className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Mark Task as Complete
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Task Completed!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Milestone Lesson - Progress gate
// ============================================

interface MilestoneLessonProps {
  lesson: Lesson;
  requiredLessonsCompleted: boolean;
  completedCount: number;
  totalRequired: number;
  onContinue?: () => void;
}

export function MilestoneLesson({
  lesson,
  requiredLessonsCompleted,
  completedCount,
  totalRequired,
  onContinue,
}: MilestoneLessonProps) {
  return (
    <Card
      className={cn(
        requiredLessonsCompleted ? "border-green-200" : "border-yellow-200",
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag
            className={cn(
              "h-5 w-5",
              requiredLessonsCompleted ? "text-green-600" : "text-yellow-600",
            )}
          />
          Milestone: {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson.description && (
          <p className="text-muted-foreground">{lesson.description}</p>
        )}

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} / {totalRequired} completed
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={cn(
                "h-full transition-all",
                requiredLessonsCompleted ? "bg-green-500" : "bg-yellow-500",
              )}
              style={{
                width: `${(completedCount / totalRequired) * 100}%`,
              }}
            />
          </div>
        </div>

        {requiredLessonsCompleted ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              Milestone Reached!
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Congratulations! You can now continue to the next section.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Lock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              Milestone Locked
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              Complete all required lessons before this milestone to continue.
            </AlertDescription>
          </Alert>
        )}

        {requiredLessonsCompleted && onContinue && (
          <Button onClick={onContinue} className="w-full">
            Continue to Next Section
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// External Resource Lesson
// ============================================

interface ExternalLessonProps {
  lesson: Lesson;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function ExternalLesson({
  lesson,
  onComplete,
  isCompleted,
}: ExternalLessonProps) {
  const getExternalIcon = () => {
    switch (lesson.externalType) {
      case "youtube":
        return "🎬";
      case "github":
        return "🐙";
      case "docs":
        return "📚";
      default:
        return "🔗";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-sky-600" />
          {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson.description && (
          <p className="text-muted-foreground">{lesson.description}</p>
        )}

        {/* YouTube embed */}
        {lesson.externalType === "youtube" && lesson.externalUrl && (
          <div className="aspect-video overflow-hidden rounded-lg">
            <iframe
              src={lesson.externalUrl.replace("watch?v=", "embed/")}
              className="h-full w-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Other external links */}
        {lesson.externalUrl && lesson.externalType !== "youtube" && (
          <a
            href={lesson.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <span className="text-2xl">{getExternalIcon()}</span>
            <div className="flex-1">
              <p className="font-medium">{lesson.title}</p>
              <p className="text-sm text-muted-foreground">
                {lesson.externalUrl}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        )}

        <Separator />

        {!isCompleted ? (
          <Button
            onClick={onComplete}
            variant="outline"
            className="w-full gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Viewed
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Live Lesson
// ============================================

interface LiveLessonProps {
  lesson: Lesson;
  onJoin?: () => void;
}

export function LiveLesson({ lesson, onJoin }: LiveLessonProps) {
  const isScheduled =
    lesson.scheduledAt && new Date(lesson.scheduledAt) > new Date();
  const isLive = lesson.scheduledAt && !isScheduled && !lesson.recordingUrl;
  const hasRecording = !!lesson.recordingUrl;

  return (
    <Card className={cn(isLive && "border-red-200")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Radio
              className={cn(
                "h-5 w-5",
                isLive ? "text-red-600" : "text-rose-600",
              )}
            />
            {lesson.title}
          </CardTitle>
          {isLive && (
            <Badge className="animate-pulse bg-red-500">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-white" />
              LIVE NOW
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson.description && (
          <p className="text-muted-foreground">{lesson.description}</p>
        )}

        {isScheduled && lesson.scheduledAt && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>Scheduled Session</AlertTitle>
            <AlertDescription>
              <div className="flex items-center gap-4">
                <span>{new Date(lesson.scheduledAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(lesson.scheduledAt).toLocaleTimeString()}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isLive && lesson.externalUrl && (
          <Button
            onClick={onJoin}
            className="w-full gap-2 bg-red-600 hover:bg-red-700"
            asChild
          >
            <a
              href={lesson.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Radio className="h-4 w-4" />
              Join Live Session
            </a>
          </Button>
        )}

        {hasRecording && lesson.recordingUrl && (
          <div className="aspect-video overflow-hidden rounded-lg">
            <video
              src={lesson.recordingUrl}
              controls
              className="h-full w-full"
              poster={lesson.videoThumbnail}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Resource Lesson - Downloadable files
// ============================================

interface ResourceLessonProps {
  lesson: Lesson;
  resources: LessonResource[];
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function ResourceLesson({
  lesson,
  resources,
  onComplete,
  isCompleted,
}: ResourceLessonProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "slides":
        return "📊";
      case "code":
      case "source_code":
        return "💻";
      case "cheatsheet":
        return "📋";
      default:
        return "📎";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-slate-600" />
          {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson.description && (
          <p className="text-muted-foreground">{lesson.description}</p>
        )}

        <div className="space-y-2">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <span className="text-xl">{getResourceIcon(resource.type)}</span>
              <div className="flex-1">
                <p className="font-medium">{resource.title}</p>
                <p className="text-xs text-muted-foreground uppercase">
                  {resource.type}
                </p>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>

        {!isCompleted ? (
          <Button
            onClick={onComplete}
            variant="outline"
            className="w-full gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Downloaded
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Resources Downloaded</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Announcement Lesson
// ============================================

interface AnnouncementLessonProps {
  lesson: Lesson;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function AnnouncementLesson({
  lesson,
  onComplete,
  isCompleted,
}: AnnouncementLessonProps) {
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Megaphone className="h-5 w-5" />
          {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson.content && (
          <div className="prose max-w-none prose-neutral dark:prose-invert">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        )}

        {!isCompleted && (
          <Button
            onClick={onComplete}
            variant="outline"
            className="w-full gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Survey / Reflection Lesson
// ============================================

interface SurveyLessonProps {
  lesson: Lesson;
  onSubmit?: (responses: Record<string, string>) => void;
  isCompleted?: boolean;
}

export function SurveyLesson({
  lesson,
  onSubmit,
  isCompleted,
}: SurveyLessonProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});

  // Parse questions from content (assuming JSON format)
  const questions = lesson.content ? JSON.parse(lesson.content) : [];

  const handleSubmit = () => {
    onSubmit?.(responses);
  };

  if (isCompleted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-center justify-center gap-2 py-8">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <span className="font-medium text-green-800">
            Thank you for your feedback!
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-violet-600" />
          {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {lesson.description && (
          <p className="text-muted-foreground">{lesson.description}</p>
        )}

        {questions.map((q: { id: string; question: string }, index: number) => (
          <div key={q.id || index} className="space-y-2">
            <label className="text-sm font-medium">{q.question}</label>
            <Textarea
              value={responses[q.id] || ""}
              onChange={(e) =>
                setResponses((prev) => ({
                  ...prev,
                  [q.id]: e.target.value,
                }))
              }
              placeholder="Your response..."
              rows={3}
            />
          </div>
        ))}

        <Button onClick={handleSubmit} className="w-full gap-2">
          <CheckCircle className="h-4 w-4" />
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// Certificate Lesson
// ============================================

interface CertificateLessonProps {
  lesson: Lesson;
  certificateUrl?: string;
  courseName: string;
  studentName: string;
  completedDate?: Date;
  canClaim: boolean;
  onClaim?: () => void;
}

export function CertificateLesson({
  lesson,
  certificateUrl,
  courseName,
  studentName,
  completedDate,
  canClaim,
  onClaim,
}: CertificateLessonProps) {
  return (
    <Card className="border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50">
      <CardContent className="space-y-6 py-8 text-center">
        <Award className="mx-auto h-16 w-16 text-amber-500" />
        <h2 className="text-2xl font-bold text-amber-900">{lesson.title}</h2>

        {certificateUrl ? (
          <>
            <div className="rounded-lg border-2 border-amber-200 bg-white p-6">
              <p className="text-sm text-muted-foreground">
                This certifies that
              </p>
              <p className="my-2 text-xl font-bold text-amber-900">
                {studentName}
              </p>
              <p className="text-sm text-muted-foreground">
                has successfully completed
              </p>
              <p className="my-2 text-lg font-semibold">{courseName}</p>
              {completedDate && (
                <p className="text-sm text-muted-foreground">
                  on {new Date(completedDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-3">
              <Button asChild>
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </a>
              </Button>
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </>
        ) : canClaim ? (
          <>
            <p className="text-muted-foreground">
              Congratulations! You&apos;ve completed all requirements for this
              certificate.
            </p>
            <Button onClick={onClaim} size="lg" className="gap-2">
              <Award className="h-5 w-5" />
              Claim Your Certificate
            </Button>
          </>
        ) : (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Certificate Locked</AlertTitle>
            <AlertDescription>
              Complete all course lessons to unlock your certificate.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
