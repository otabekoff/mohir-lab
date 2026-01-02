"use client";

// ============================================
// Learning Player Component - Multi-type support
// ============================================

import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Download,
  BookOpen,
  FileText,
  AlertCircle,
  RotateCcw,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { markLessonComplete } from "@/actions/enrollments";
import { toast } from "sonner";
import { LessonRenderer, LessonTypeBadge } from "@/components/lessons";
import {
  LessonType,
  LessonProgress,
  LessonResource,
  QuizQuestion,
} from "@/types";

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  type: LessonType;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  subtitlesUrl?: string | null;
  content?: string | null;
  duration: number;
  isFree: boolean;

  // Quiz fields
  passingScore?: number | null;
  timeLimit?: number | null;
  shuffleOptions?: boolean | null;
  showAnswers?: boolean | null;

  // Assignment fields
  instructions?: string | null;
  allowFileUpload?: boolean | null;
  allowTextSubmission?: boolean | null;
  allowedFileTypes?: string | null;
  maxFileSize?: number | null;
  dueDate?: Date | null;

  // Coding fields
  starterCode?: string | null;
  solutionCode?: string | null;
  language?: string | null;
  testCases?: string | null;

  // External fields
  externalUrl?: string | null;
  externalType?: string | null;
  scheduledAt?: Date | null;
  recordingUrl?: string | null;

  // Relations
  resources?: LessonResource[];
  questions?: QuizQuestion[];
}

interface LearningPlayerProps {
  lesson: Lesson | null;
  progress?: LessonProgress | null;
  isCompleted?: boolean;
  onComplete?: () => void;
}

// Fallback sample video when videoUrl doesn't work
const FALLBACK_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export function LearningPlayer({
  lesson,
  progress,
  isCompleted = false,
  onComplete,
}: LearningPlayerProps) {
  const [prevLessonId, setPrevLessonId] = useState(lesson?.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(isCompleted);
  const [isPending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset state when lesson changes - using the "reset state on prop change" pattern
  if (lesson?.id !== prevLessonId) {
    setPrevLessonId(lesson?.id);
    setIsPlaying(false);
    setHasError(false);
    setUseFallback(false);
    setLessonCompleted(isCompleted);
  }

  if (!lesson) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No lessons available</h2>
          <p className="mt-2 text-muted-foreground">
            This course doesn&apos;t have any lessons yet.
          </p>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setHasError(false);
  };

  const handleVideoError = () => {
    console.error("Video playback error for URL:", lesson.videoUrl);
    if (!useFallback && lesson.videoUrl) {
      // Try fallback video
      setUseFallback(true);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setUseFallback(false);
    setIsPlaying(false);
  };

  const handleVideoEnded = () => {
    if (!lessonCompleted) {
      handleMarkComplete();
    }
  };

  const handleMarkComplete = () => {
    startTransition(async () => {
      try {
        const result = await markLessonComplete(lesson.id);
        setLessonCompleted(true);

        if (result.isCompleted) {
          toast.success("🎉 Congratulations!", {
            description:
              "You've completed this course! Your certificate is ready.",
          });
        } else {
          toast.success("Lesson completed!", {
            description: `Progress: ${Math.round(result.progress)}%`,
          });
        }

        onComplete?.();
      } catch (error) {
        toast.error("Failed to mark lesson as complete");
        console.error(error);
      }
    });
  };

  // Convert lesson to the format expected by LessonRenderer
  const normalizedLesson = {
    ...lesson,
    description: lesson.description || undefined,
    videoUrl: useFallback ? FALLBACK_VIDEO : lesson.videoUrl || undefined,
    videoThumbnail: lesson.videoThumbnail || undefined,
    subtitlesUrl: lesson.subtitlesUrl || undefined,
    content: lesson.content || undefined,
    passingScore: lesson.passingScore || undefined,
    timeLimit: lesson.timeLimit || undefined,
    shuffleOptions: lesson.shuffleOptions || undefined,
    showAnswers: lesson.showAnswers || undefined,
    instructions: lesson.instructions || undefined,
    allowFileUpload: lesson.allowFileUpload || undefined,
    allowTextSubmission: lesson.allowTextSubmission || undefined,
    allowedFileTypes: lesson.allowedFileTypes || undefined,
    maxFileSize: lesson.maxFileSize || undefined,
    dueDate: lesson.dueDate || undefined,
    starterCode: lesson.starterCode || undefined,
    solutionCode: lesson.solutionCode || undefined,
    language: lesson.language || undefined,
    testCases: lesson.testCases || undefined,
    externalUrl: lesson.externalUrl || undefined,
    externalType: lesson.externalType || undefined,
    scheduledAt: lesson.scheduledAt || undefined,
    recordingUrl: lesson.recordingUrl || undefined,
    resources: lesson.resources,
    order: 0, // Not needed for rendering
  };

  // For video lessons, use the custom video player with better controls
  const isVideoLesson = lesson.type === "video";

  return (
    <div className="flex flex-col">
      {/* Lesson Type Badge */}
      <div className="border-b bg-muted/30 px-6 py-3">
        <div className="flex items-center justify-between">
          <LessonTypeBadge type={lesson.type} />
          {lesson.duration > 0 && isVideoLesson && (
            <span className="text-sm text-muted-foreground">
              {formatDuration(lesson.duration)}
            </span>
          )}
        </div>
      </div>

      {/* Video Player (only for video lessons) */}
      {isVideoLesson && (
        <div className="relative aspect-video bg-black">
          {hasError ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-white">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="font-medium">Video could not be loaded</p>
              <p className="text-sm text-gray-400">
                The video file might be unavailable or there&apos;s a network
                issue.
              </p>
              <Button
                onClick={handleRetry}
                variant="secondary"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : isPlaying ? (
            <video
              ref={videoRef}
              src={
                useFallback ? FALLBACK_VIDEO : lesson.videoUrl || FALLBACK_VIDEO
              }
              controls
              autoPlay
              className="h-full w-full object-contain"
              onError={handleVideoError}
              onEnded={handleVideoEnded}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handlePlay}
                className="gap-2"
                variant="secondary"
              >
                <Play className="h-5 w-5" />
                Play Video
              </Button>
              <p className="text-sm text-muted-foreground">
                Click to start watching
              </p>
              {useFallback && (
                <p className="text-xs text-yellow-400">
                  Using sample video (original not available)
                </p>
              )}
            </div>
          )}
          {lesson.duration > 0 && !isPlaying && (
            <div className="absolute right-4 bottom-4 rounded bg-black/70 px-2 py-1 text-xs text-white">
              {formatDuration(lesson.duration)}
            </div>
          )}
        </div>
      )}

      {/* Non-video lesson content */}
      {!isVideoLesson && (
        <div className="p-6">
          <LessonRenderer
            lesson={normalizedLesson}
            progress={progress}
            questions={lesson.questions}
            resources={lesson.resources}
            onComplete={handleMarkComplete}
            onQuizSubmit={(score, passed) => {
              if (passed) {
                handleMarkComplete();
              }
            }}
          />
        </div>
      )}

      {/* Lesson Info & Resources (for video lessons) */}
      {isVideoLesson && (
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{lesson.title}</h2>
            {lessonCompleted ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkComplete}
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Mark as Complete
              </Button>
            )}
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About this lesson</CardTitle>
                </CardHeader>
                <CardContent>
                  {lesson.description ? (
                    <p className="text-muted-foreground">
                      {lesson.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No description available for this lesson.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Downloadable Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lesson.resources && lesson.resources.length > 0 ? (
                    <div className="space-y-2">
                      {lesson.resources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                          >
                            {resource.type === "pdf" && (
                              <FileText className="h-4 w-4" />
                            )}
                            {resource.type === "code" && (
                              <Download className="h-4 w-4" />
                            )}
                            {!["pdf", "code"].includes(resource.type) && (
                              <Download className="h-4 w-4" />
                            )}
                            {resource.title}
                          </Button>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No resources available for this lesson.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Take notes here..."
                    className="min-h-50 w-full resize-none rounded-md border bg-transparent p-3 text-sm"
                  />
                  <Button className="mt-4">Save Notes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
