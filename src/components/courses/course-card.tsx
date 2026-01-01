// ============================================
// Course Card Component
// ============================================

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, PlayCircle } from "lucide-react";
import type { Course } from "@/types";
// cn utility can be used for conditional classes if needed

interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact";
}

export function CourseCard({ course }: CourseCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden py-0 transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <Link
          href={`/courses/${course.slug}`}
          className="relative block aspect-video overflow-hidden"
        >
          <Image
            src={
              course.thumbnail ||
              "https://picsum.photos/seed/placeholder/800/450"
            }
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized={course.thumbnail?.startsWith("https://picsum.photos")}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <PlayCircle className="h-12 w-12 text-white" />
          </div>
          {course.isFeatured && (
            <Badge className="absolute top-2 left-2" variant="default">
              Featured
            </Badge>
          )}
          {course.discountPrice && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              Sale
            </Badge>
          )}
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {course.level.replace("-", " ")}
          </Badge>
          <span>•</span>
          <span>{course.category.name}</span>
        </div>

        <Link href={`/courses/${course.slug}`}>
          <h3 className="line-clamp-2 font-semibold transition-colors group-hover:text-primary">
            {course.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.shortDescription}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.studentsCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{course.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({course.reviewsCount.toLocaleString()} reviews)
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-2">
          {course.discountPrice ? (
            <>
              <span className="text-lg font-bold">
                {formatPrice(course.discountPrice)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(course.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">
              {formatPrice(course.price)}
            </span>
          )}
        </div>
        <Button size="sm" asChild>
          <Link href={`/courses/${course.slug}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
