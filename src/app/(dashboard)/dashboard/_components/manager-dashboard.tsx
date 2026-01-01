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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, BookOpen, MessageSquare, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import type { UserRole } from "@/types";

interface ManagerDashboardProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

// Mock stats data
const stats = [
  {
    title: "Active Students",
    value: "15,420",
    description: "Learning this month",
    icon: Users,
  },
  {
    title: "Total Courses",
    value: "24",
    description: "Published courses",
    icon: BookOpen,
  },
  {
    title: "Pending Reviews",
    value: "12",
    description: "Awaiting approval",
    icon: MessageSquare,
  },
  {
    title: "Completion Rate",
    value: "68%",
    description: "Average completion",
    icon: TrendingUp,
  },
];

const pendingReviews = [
  {
    id: "1",
    student: "John Doe",
    course: "Complete Web Development",
    rating: 4,
    date: "2025-12-28",
  },
  {
    id: "2",
    student: "Jane Smith",
    course: "Python for Data Science",
    rating: 5,
    date: "2025-12-28",
  },
  {
    id: "3",
    student: "Mike Johnson",
    course: "React & Next.js Masterclass",
    rating: 4,
    date: "2025-12-27",
  },
];

export function ManagerDashboard({ user }: ManagerDashboardProps) {
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    {review.student}
                  </TableCell>
                  <TableCell>{review.course}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {review.rating}/5
                    </div>
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost">
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
