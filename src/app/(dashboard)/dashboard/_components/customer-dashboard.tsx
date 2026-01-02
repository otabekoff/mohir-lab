// ============================================
// Customer Dashboard Component
// ============================================

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Clock, PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCustomerDashboardStats } from "@/actions/dashboard";
import { getContinueLearning } from "@/actions/enrollments";
import type { UserRole } from "@/types";

interface CustomerDashboardProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

export async function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [stats, enrolledCourses] = await Promise.all([
    getCustomerDashboardStats(),
    getContinueLearning(6),
  ]);

  const statsCards = [
    {
      title: "Enrolled Courses",
      value: stats.enrollments.total.toString(),
      icon: BookOpen,
    },
    {
      title: "Certificates Earned",
      value: stats.certificates.toString(),
      icon: Award,
    },
    {
      title: "Hours Learned",
      value: stats.watchTime.hours.toString(),
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Continue where you left off.
          </p>
        </div>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Summary */}
      {stats.enrollments.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>
              Your overall course completion status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.enrollments.completed}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.enrollments.inProgress}
                </div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {Math.round(stats.averageProgress)}%
                </div>
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Learning */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/my-courses">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No courses yet</h3>
              <p className="mb-4 text-muted-foreground">
                Start your learning journey by enrolling in a course
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((enrollment) => (
              <Card key={enrollment.id} className="overflow-hidden py-0">
                <div className="relative aspect-video bg-muted">
                  {enrollment.course.thumbnail ? (
                    <Image
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {enrollment.completedAt && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Badge className="px-3 py-1 text-lg">
                        <Award className="mr-2 h-5 w-5" />
                        Completed
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base">
                    {enrollment.course.title}
                  </CardTitle>
                  <CardDescription>
                    {enrollment.completedLessons} of{" "}
                    {enrollment.course.lessonsCount} lessons completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <Progress value={enrollment.progress} />
                  </div>

                  {!enrollment.completedAt ? (
                    <Button className="w-full" asChild>
                      <Link href={`/learn/${enrollment.course.slug}`}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href="/dashboard/certificates">
                        <Award className="mr-2 h-4 w-4" />
                        View Certificate
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" asChild>
            <Link href="/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse More Courses
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/certificates">
              <Award className="mr-2 h-4 w-4" />
              View Certificates
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings">Update Profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
