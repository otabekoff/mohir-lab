// ============================================
// Analytics Page (Admin/Manager)
// ============================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getAnalyticsOverview,
  getRevenueChart,
  getTopCourses,
  getCategoryStats,
  getRecentActivity,
} from "@/actions/admin/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Users,
  BookOpen,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Star,
  CreditCard,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["owner", "manager"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const [overview, , topCourses, categoryStats, recentActivity] =
    await Promise.all([
      getAnalyticsOverview(30),
      getRevenueChart(30),
      getTopCourses(5),
      getCategoryStats(),
      getRecentActivity(10),
    ]);

  const totalCategoryEnrollments = categoryStats.reduce(
    (sum, cat) => sum + cat.enrollmentsCount,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Overview of your platform performance (Last 30 days)
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overview.revenue.value.toFixed(2)}
            </div>
            <div className="flex items-center text-xs">
              {overview.revenue.change >= 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">
                    +{overview.revenue.change}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">
                    {overview.revenue.change}%
                  </span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.orders.value}</div>
            <div className="flex items-center text-xs">
              {overview.orders.change >= 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">
                    +{overview.orders.change}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">
                    {overview.orders.change}%
                  </span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.enrollments.value}
            </div>
            <div className="flex items-center text-xs">
              {overview.enrollments.change >= 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">
                    +{overview.enrollments.change}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">
                    {overview.enrollments.change}%
                  </span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.students.value}</div>
            <p className="text-xs text-muted-foreground">
              +{overview.students.newStudents} new this period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Courses</CardTitle>
            <CardDescription>
              Best performing courses by enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="relative h-12 w-20 overflow-hidden rounded bg-muted">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 font-medium">{course.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrollments}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {course.revenue.toFixed(0)}
                      </span>
                      {course.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {course.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Enrollments by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category) => {
                const percentage =
                  totalCategoryEnrollments > 0
                    ? (category.enrollmentsCount / totalCategoryEnrollments) *
                      100
                    : 0;

                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{category.icon || "📁"}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {category.enrollmentsCount} enrollments
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-center gap-4"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.image || ""} />
                  <AvatarFallback>
                    {activity.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">
                      {activity.user.name || "Someone"}
                    </span>{" "}
                    {activity.type === "order" && (
                      <>
                        purchased{" "}
                        <span className="font-medium">{activity.course}</span>{" "}
                        for{" "}
                        <span className="font-medium">
                          ${activity.amount?.toFixed(2)}
                        </span>
                      </>
                    )}
                    {activity.type === "enrollment" && (
                      <>
                        enrolled in{" "}
                        <span className="font-medium">{activity.course}</span>
                      </>
                    )}
                    {activity.type === "review" && (
                      <>
                        reviewed{" "}
                        <span className="font-medium">{activity.course}</span>{" "}
                        <span className="inline-flex items-center">
                          ({activity.rating}
                          <Star className="ml-0.5 h-3 w-3 fill-yellow-400 text-yellow-400" />
                          )
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    activity.type === "order"
                      ? "bg-green-500/10 text-green-600"
                      : activity.type === "enrollment"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-yellow-500/10 text-yellow-600"
                  }
                >
                  {activity.type === "order" && (
                    <CreditCard className="mr-1 h-3 w-3" />
                  )}
                  {activity.type === "enrollment" && (
                    <UserPlus className="mr-1 h-3 w-3" />
                  )}
                  {activity.type === "review" && (
                    <MessageSquare className="mr-1 h-3 w-3" />
                  )}
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
