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
import type { UserRole } from "@/types";

interface OwnerDashboardProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

// Mock stats data
const stats = [
  {
    title: "Total Revenue",
    value: "$128,420",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Students",
    value: "15,420",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Courses",
    value: "24",
    change: "+2",
    trend: "up",
    icon: BookOpen,
  },
  {
    title: "Conversion Rate",
    value: "4.5%",
    change: "-0.3%",
    trend: "down",
    icon: TrendingUp,
  },
];

const recentOrders = [
  {
    id: "1",
    student: "John Doe",
    email: "john@example.com",
    course: "Complete Web Development",
    amount: "$49.99",
    status: "completed",
    date: "2025-12-28",
  },
  {
    id: "2",
    student: "Jane Smith",
    email: "jane@example.com",
    course: "Python for Data Science",
    amount: "$129.99",
    status: "completed",
    date: "2025-12-28",
  },
  {
    id: "3",
    student: "Mike Johnson",
    email: "mike@example.com",
    course: "React & Next.js Masterclass",
    amount: "$79.99",
    status: "pending",
    date: "2025-12-27",
  },
  {
    id: "4",
    student: "Sarah Williams",
    email: "sarah@example.com",
    course: "Complete Web Development",
    amount: "$49.99",
    status: "completed",
    date: "2025-12-27",
  },
];

export function OwnerDashboard({ user }: OwnerDashboardProps) {
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
                <span className="ml-1 text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
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
                    <div>
                      <div className="font-medium">{order.student}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.course}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
