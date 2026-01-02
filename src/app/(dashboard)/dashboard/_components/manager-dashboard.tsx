// ============================================
// Manager Dashboard Component
// ============================================

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Plus,
  Star,
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getRecentEnrollments } from "@/actions/dashboard";
import { getPendingReviews } from "@/actions/reviews";
import { format } from "date-fns";
import type { UserRole } from "@/types";

interface ManagerDashboardProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

export async function ManagerDashboard({ user }: ManagerDashboardProps) {
  const [stats, recentEnrollments, pendingReviews] = await Promise.all([
    getDashboardStats(),
    getRecentEnrollments(5),
    getPendingReviews(5),
  ]);

  const statsCards = [
    {
      title: "Active Students",
      value: stats.students.total.toLocaleString(),
      description: `+${stats.students.thisMonth} this month`,
      icon: Users,
    },
    {
      title: "Total Courses",
      value: stats.courses.published.toString(),
      description: `${stats.courses.draft} drafts`,
      icon: BookOpen,
    },
    {
      title: "Pending Reviews",
      value: pendingReviews.length.toString(),
      description: "Awaiting approval",
      icon: MessageSquare,
    },
    {
      title: "Avg Rating",
      value: stats.reviews.averageRating.toFixed(1),
      description: `${stats.reviews.total} total reviews`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here&apos;s what needs your attention.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Enrollments</CardTitle>
              <CardDescription>New student enrollments</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/students">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentEnrollments.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                No enrollments yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={enrollment.user.image ?? undefined} />
                      <AvatarFallback>
                        {enrollment.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {enrollment.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {enrollment.course.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(enrollment.enrolledAt), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Reviews waiting for approval</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/reviews">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingReviews.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                No pending reviews
              </p>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={review.user.image ?? undefined} />
                      <AvatarFallback>
                        {review.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {review.user.name}
                        </p>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="ml-1 text-xs">{review.rating}</span>
                        </div>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {review.course.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
