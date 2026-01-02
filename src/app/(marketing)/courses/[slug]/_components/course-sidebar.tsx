"use client";

// ============================================
// Course Sidebar Component
// ============================================

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  Clock,
  BookOpen,
  Award,
  Download,
  Infinity,
  Heart,
  Share2,
  Check,
  Loader2,
  Copy,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Course } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { enrollInCourse, isEnrolled } from "@/actions/enrollments";
import { toggleWishlist, isInWishlist } from "@/actions/wishlist";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { isAuthenticated, signIn } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEnrolledState, setIsEnrolledState] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(true);

  // Load enrollment and wishlist state on mount
  useEffect(() => {
    const loadState = async () => {
      if (!isAuthenticated) {
        setIsLoadingState(false);
        return;
      }
      try {
        const [enrolled, wishlisted] = await Promise.all([
          isEnrolled(course.id),
          isInWishlist(course.id),
        ]);
        setIsEnrolledState(enrolled);
        setIsWishlisted(wishlisted);
      } catch (error) {
        console.error("Failed to load state:", error);
      }
      setIsLoadingState(false);
    };
    loadState();
  }, [isAuthenticated, course.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const discountPercentage = course.discountPrice
    ? Math.round((1 - course.discountPrice / course.price) * 100)
    : 0;

  const handleEnroll = () => {
    if (!isAuthenticated) {
      signIn(undefined, { callbackUrl: `/courses/${course.slug}` });
      return;
    }

    startTransition(async () => {
      try {
        await enrollInCourse(course.id);
        setIsEnrolledState(true);
        toast.success("Successfully enrolled!", {
          description: "You can now access all course content.",
        });
        router.push(`/learn/${course.slug}`);
      } catch (error) {
        toast.error("Enrollment failed", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      signIn(undefined, { callbackUrl: `/courses/${course.slug}` });
      return;
    }

    startTransition(async () => {
      const result = await toggleWishlist(course.id);
      if (result.success) {
        setIsWishlisted(!isWishlisted);
        toast.success(
          isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        );
      } else {
        toast.error(result.error || "Failed to update wishlist");
      }
    });
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: course.shortDescription,
          url: shareUrl,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      setIsShareOpen(true);
    }
  };

  const copyShareUrl = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`;

    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
    setIsShareOpen(false);
  };

  const handleGoToLearn = () => {
    router.push(`/learn/${course.slug}`);
  };

  return (
    <>
      <div className="sticky top-20">
        <Card className="overflow-hidden py-0">
          {/* Preview Image/Video */}
          <div className="relative aspect-video bg-muted">
            <Image
              src={course.thumbnail || "/images/course-placeholder.jpg"}
              alt={course.title}
              fill
              className="object-cover"
            />
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="group absolute inset-0 flex items-center justify-center bg-black/40 transition-colors hover:bg-black/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 text-primary" />
              </div>
            </button>
            <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
              Preview this course
            </span>
          </div>

          <CardContent className="space-y-6 p-6">
            {/* Price */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {formatPrice(course.discountPrice || course.price)}
                </span>
                {course.discountPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(course.price)}
                    </span>
                    <Badge variant="destructive">
                      {discountPercentage}% off
                    </Badge>
                  </>
                )}
              </div>
              {course.discountPrice && (
                <p className="mt-1 text-sm text-destructive">
                  🔥 Sale ends in 2 days!
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {isLoadingState ? (
                <Button size="lg" className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              ) : isEnrolledState ? (
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleGoToLearn}
                >
                  <Check className="h-4 w-4" />
                  Go to Course
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleEnroll}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isAuthenticated ? (
                    "Enroll Now"
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleWishlist}
                  disabled={isPending}
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isWishlisted ? "Saved" : "Wishlist"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              30-Day Money-Back Guarantee
            </p>

            <Separator />

            {/* Course Includes */}
            <div>
              <h3 className="mb-4 font-semibold">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDuration(course.duration)} on-demand video</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.lessonsCount} lessons</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>Downloadable resources</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Infinity className="h-4 w-4 text-muted-foreground" />
                  <span>Full lifetime access</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Video Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription>
              Watch a preview of what you&apos;ll learn in this course
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full bg-black">
            {course.previewVideo ? (
              <video
                src={course.previewVideo}
                controls
                autoPlay
                className="h-full w-full"
                onError={(e) => {
                  console.error("Preview video error:", e);
                }}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="flex h-full items-center justify-center text-white">
                <div className="text-center">
                  <AlertCircle className="mx-auto mb-4 h-16 w-16 opacity-50" />
                  <p className="text-lg">No preview video available</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Check out the free lessons marked as &quot;Preview&quot; in
                    the curriculum below
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this course</DialogTitle>
            <DialogDescription>
              Share this course with friends and colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={
                  typeof window !== "undefined"
                    ? window.location.href
                    : `/courses/${course.slug}`
                }
                className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm"
              />
              <Button onClick={copyShareUrl} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
