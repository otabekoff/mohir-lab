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
import type { UserRole } from "@/types";

interface CustomerDashboardProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

// Mock stats data
const stats = [
  {
    title: "Enrolled Courses",
    value: "5",
    icon: BookOpen,
  },
  {
    title: "Certificates Earned",
    value: "2",
    icon: Award,
  },
  {
    title: "Hours Learned",
    value: "48",
    icon: Clock,
  },
];

// Mock enrolled courses
const enrolledCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp 2026",
    thumbnail: "/images/courses/web-dev.jpg",
    progress: 65,
    nextLesson: "JavaScript Async Patterns",
    totalLessons: 320,
    completedLessons: 208,
    lastAccessed: "2025-12-28",
  },
  {
    id: "2",
    title: "Advanced React & Next.js Masterclass",
    thumbnail: "/images/courses/react-next.jpg",
    progress: 30,
    nextLesson: "Server Components Deep Dive",
    totalLessons: 180,
    completedLessons: 54,
    lastAccessed: "2025-12-27",
  },
  {
    id: "3",
    title: "Python for Data Science",
    thumbnail: "/images/courses/python-ml.jpg",
    progress: 100,
    nextLesson: null,
    totalLessons: 280,
    completedLessons: 280,
    lastAccessed: "2025-12-20",
  },
];

export function CustomerDashboard({ user }: CustomerDashboardProps) {
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
        {stats.map((stat) => (
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {course.progress === 100 && (
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
                  {course.title}
                </CardTitle>
                <CardDescription>
                  {course.completedLessons} of {course.totalLessons} lessons
                  completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>

                {course.nextLesson ? (
                  <Button className="w-full" asChild>
                    <Link href={`/learn/${course.id}`}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Continue: {course.nextLesson}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/dashboard/certificates`}>
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
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
