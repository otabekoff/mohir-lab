// ============================================
// Owner Dashboard Component
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getRecentOrders } from "@/actions/dashboard";
import { format } from "date-fns";
import type { UserRole } from "@/types";

interface OwnerDashboardProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export async function OwnerDashboard({ user }: OwnerDashboardProps) {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(5),
  ]);

  const statsCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.revenue.total),
      change: `${stats.revenue.growth >= 0 ? "+" : ""}${stats.revenue.growth.toFixed(1)}%`,
      trend: stats.revenue.growth >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Total Students",
      value: stats.students.total.toLocaleString(),
      change: `+${stats.students.thisMonth} this month`,
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Courses",
      value: stats.courses.published.toString(),
      change: `${stats.courses.draft} drafts`,
      trend: "up",
      icon: BookOpen,
    },
    {
      title: "Enrollments",
      value: stats.enrollments.total.toLocaleString(),
      change: `${stats.enrollments.growth >= 0 ? "+" : ""}${stats.enrollments.growth.toFixed(1)}%`,
      trend: stats.enrollments.growth >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here&apos;s an overview of your platform.
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
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Review Summary</CardTitle>
            <CardDescription>Course ratings and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">
                {stats.reviews.averageRating.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center text-yellow-500">
                  {"★".repeat(Math.round(stats.reviews.averageRating))}
                  {"☆".repeat(5 - Math.round(stats.reviews.averageRating))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.reviews.total} reviews
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>Revenue vs Last Month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <span className="font-medium">
                  {formatCurrency(stats.revenue.thisMonth)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Month
                </span>
                <span className="font-medium">
                  {formatCurrency(stats.revenue.lastMonth)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest course purchases on your platform
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No orders yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={order.user.image ?? undefined} />
                          <AvatarFallback>
                            {order.user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{order.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-50 truncate">
                      {order.course.title}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(Number(order.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
