// ============================================
// Course Reviews Component
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface CourseReviewsProps {
  rating: number;
  reviewsCount: number;
}

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    user: {
      name: "James Wilson",
      image: "/users/user1.jpg",
    },
    rating: 5,
    comment:
      "This is the best web development course I have ever taken! The instructor explains everything clearly and the projects are very practical. Highly recommended!",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "2",
    user: {
      name: "Maria Garcia",
      image: "/users/user2.jpg",
    },
    rating: 5,
    comment:
      "Coming from a non-technical background, I was worried this would be too difficult. But Alex's teaching style made everything easy to understand. I'm now working as a junior developer!",
    createdAt: new Date("2025-12-10"),
  },
  {
    id: "3",
    user: {
      name: "David Kim",
      image: "/users/user3.jpg",
    },
    rating: 4,
    comment:
      "Great course overall. The React and Next.js sections are especially good. Would have liked more on testing, but that's a minor complaint.",
    createdAt: new Date("2025-12-05"),
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 78 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];

export function CourseReviews({ rating, reviewsCount }: CourseReviewsProps) {
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
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex w-16 items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{item.stars}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2 flex-1" />
                  <span className="w-10 text-sm text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.image} alt={review.user.name} />
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
                  <p className="mt-3 text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </section>
  );
}
