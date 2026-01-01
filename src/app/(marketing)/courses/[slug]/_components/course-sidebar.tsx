"use client";

// ============================================
// Course Sidebar Component
// ============================================

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Clock,
  BookOpen,
  Award,
  Download,
  Infinity,
  Heart,
  Share2,
} from "lucide-react";
import type { Course } from "@/types";
import { useAuth } from "@/hooks/use-auth";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  return (
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
          <button className="group absolute inset-0 flex items-center justify-center bg-black/40 transition-colors hover:bg-black/50">
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
                  <Badge variant="destructive">{discountPercentage}% off</Badge>
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
            <Button size="lg" className="w-full">
              {isAuthenticated ? "Enroll Now" : "Buy Now"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
                {isWishlisted ? "Saved" : "Wishlist"}
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
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
  );
}
