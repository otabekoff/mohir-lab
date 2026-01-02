"use client";

// ============================================
// Learning Player Component
// ============================================

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  Download,
  BookOpen,
  FileText,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration: number;
  isFree: boolean;
}

interface LearningPlayerProps {
  lesson: Lesson | null;
}

// Fallback sample video when videoUrl doesn't work
const FALLBACK_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export function LearningPlayer({ lesson }: LearningPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset states when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setHasError(false);
    setUseFallback(false);
  }, [lesson?.id]);

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

  const videoSrc = useFallback
    ? FALLBACK_VIDEO
    : lesson.videoUrl || FALLBACK_VIDEO;

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

  return (
    <div className="flex flex-col">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {hasError ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-white">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <p className="font-medium">Video could not be loaded</p>
            <p className="text-sm text-gray-400">
              The video file might be unavailable or there&apos;s a network
              issue.
            </p>
            <Button onClick={handleRetry} variant="secondary" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : isPlaying ? (
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay
            className="h-full w-full object-contain"
            onError={handleVideoError}
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

      {/* Lesson Info & Resources */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold">{lesson.title}</h2>

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
                  <p className="text-muted-foreground">{lesson.description}</p>
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
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Lesson slides (PDF)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Source code
                  </Button>
                </div>
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
    </div>
  );
}
