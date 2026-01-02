// ============================================
// Course Reviews Component
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { getCourseReviewsBySlug, getReviewStats } from "@/actions/reviews";
import prisma from "@/lib/prisma";

interface CourseReviewsProps {
  courseSlug: string;
  rating: number;
  reviewsCount: number;
}

export async function CourseReviews({
  courseSlug,
  rating,
  reviewsCount,
}: CourseReviewsProps) {
  const reviews = await getCourseReviewsBySlug(courseSlug, 5);

  // Get course ID for stats
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true },
  });

  const stats = course ? await getReviewStats(course.id) : null;

  const ratingDistribution = stats?.distribution || [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Student Reviews</h2>

      <div className="mb-8 grid gap-8 md:grid-cols-3">
        {/* Rating Summary */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="text-5xl font-bold">{rating.toFixed(1)}</div>
            <div className="my-2 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Course Rating • {reviewsCount.toLocaleString()} reviews
            </p>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="space-y-3">
              {ratingDistribution
                .slice()
                .reverse()
                .map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <div className="flex w-16 items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{item.stars}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2 flex-1" />
                    <span className="w-10 text-sm text-muted-foreground">
                      {Math.round(item.percentage)}%
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No reviews yet. Be the first to review this course!
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={review.user.image || undefined}
                      alt={review.user.name}
                    />
                    <AvatarFallback>
                      {review.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{review.user.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {reviews.length > 0 && reviewsCount > 5 && (
        <div className="mt-6 text-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      )}
    </section>
  );
}
