// ============================================
// My Courses Page (Customer)
// ============================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserEnrollments } from "@/actions/enrollments";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PlayCircle, Award, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function MyCoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const enrollments = await getUserEnrollments();

  const inProgress = enrollments.filter((e) => !e.completedAt);
  const completed = enrollments.filter((e) => e.completedAt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Track your progress and continue learning
          </p>
        </div>
        <Button asChild>
          <Link href="/courses">Browse More Courses</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrolled
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({enrollments.length})</TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <CourseGrid enrollments={enrollments} />
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-6">
          <CourseGrid enrollments={inProgress} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <CourseGrid enrollments={completed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseGrid({
  enrollments,
}: {
  enrollments: Awaited<ReturnType<typeof getUserEnrollments>>;
}) {
  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No courses found</h3>
          <p className="mb-4 text-muted-foreground">
            Start your learning journey by enrolling in a course
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {enrollments.map((enrollment) => (
        <Card key={enrollment.id} className="flex flex-col overflow-hidden py-0">
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
                <Badge className="bg-green-600 px-3 py-1 text-lg">
                  <Award className="mr-2 h-5 w-5" />
                  Completed
                </Badge>
              </div>
            )}
          </div>
          <CardHeader className="flex-1 pb-2">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{enrollment.course.category.name}</Badge>
              <Badge variant="secondary">{enrollment.course.level}</Badge>
            </div>
            <CardTitle className="line-clamp-2 text-base">
              {enrollment.course.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {enrollment.course.shortDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {Math.round(enrollment.progress)}%
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
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/learn/${enrollment.course.slug}`}>Review</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/dashboard/certificates">
                    <Award className="mr-2 h-4 w-4" />
                    Certificate
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
