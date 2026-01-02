"use client";

// ============================================
// Learning Player Component
// ============================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Download, BookOpen, FileText } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string;
  duration: number;
  isFree: boolean;
}

interface LearningPlayerProps {
  lesson: Lesson | null;
}

export function LearningPlayer({ lesson }: LearningPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="flex flex-col">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {isPlaying && lesson.videoUrl ? (
          <video
            src={lesson.videoUrl}
            controls
            autoPlay
            className="h-full w-full object-contain"
            onError={(e) => {
              console.error("Video playback error:", e);
            }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            {lesson.videoUrl ? (
              <>
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="gap-2"
                  variant="secondary"
                >
                  <Play className="h-5 w-5" />
                  Play Video
                </Button>
                <p className="text-sm text-muted-foreground">
                  Click to start watching
                </p>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-muted p-6 text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="font-medium">Video not available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This lesson doesn&apos;t have a video URL configured yet.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        {lesson.duration > 0 && (
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
