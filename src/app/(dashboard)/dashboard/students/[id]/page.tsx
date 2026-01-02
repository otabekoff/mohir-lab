// ============================================
// Student Detail Page
// ============================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentById } from "@/actions/admin/students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  BookOpen,
  DollarSign,
  Mail,
  Star,
  Award,
  Calendar,
} from "lucide-react";
import { SendNotificationDialog } from "@/components/send-notification-dialog";

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(date));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/students">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Student Details</h1>
          <p className="text-muted-foreground">
            View student information and activity
          </p>
        </div>
      </div>

      {/* Student Profile Card */}
      <Card>
        <CardContent className="flex items-start gap-6 pt-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={student.image || undefined} alt={student.name} />
            <AvatarFallback className="text-2xl">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href={`mailto:${student.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
                <SendNotificationDialog
                  targetType="user"
                  targetId={student.id}
                  targetName={student.name}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {student.enrollments.length}
                </span>
                <span className="text-muted-foreground">Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatPrice(student.totalSpent)}
                </span>
                <span className="text-muted-foreground">Total Spent</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{student.reviews.length}</span>
                <span className="text-muted-foreground">Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {student.certificates.length}
                </span>
                <span className="text-muted-foreground">Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Joined {formatDate(student.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different data */}
      <Tabs defaultValue="enrollments">
        <TabsList>
          <TabsTrigger value="enrollments">
            Enrollments ({student.enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="orders">
            Orders ({student.orders.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({student.reviews.length})
          </TabsTrigger>
          <TabsTrigger value="certificates">
            Certificates ({student.certificates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {student.enrollments.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No enrollments yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Enrolled At</TableHead>
                      <TableHead>Last Access</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/courses/${enrollment.course.id}`}
                            className="font-medium hover:underline"
                          >
                            {enrollment.course.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(enrollment.progress)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(enrollment.enrolledAt)}
                        </TableCell>
                        <TableCell>
                          {formatDate(enrollment.lastAccessAt)}
                        </TableCell>
                        <TableCell>
                          {enrollment.completedAt ? (
                            <Badge variant="default">Completed</Badge>
                          ) : enrollment.progress > 0 ? (
                            <Badge variant="secondary">In Progress</Badge>
                          ) : (
                            <Badge variant="outline">Not Started</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {student.orders.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No orders yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>{order.course.title}</TableCell>
                        <TableCell>{formatPrice(order.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {student.reviews.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No reviews yet
                </p>
              ) : (
                <div className="space-y-4">
                  {student.reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/dashboard/courses/${review.course.id}`}
                          className="font-medium hover:underline"
                        >
                          {review.course.title}
                        </Link>
                        <div className="flex items-center gap-1">
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
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {review.comment}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Earned Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              {student.certificates.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No certificates yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Certificate ID</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Issued At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.certificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-mono">
                          {cert.certificateId}
                        </TableCell>
                        <TableCell>{cert.course.title}</TableCell>
                        <TableCell>{formatDate(cert.issuedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
