// ============================================
// Certificates Page (Customer)
// ============================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserCertificates } from "@/actions/certificates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function CertificatesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const certificates = await getUserCertificates();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-muted-foreground">
          View and download your earned certificates
        </p>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Certificates
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{certificates.length}</div>
          <p className="text-xs text-muted-foreground">
            Complete more courses to earn certificates
          </p>
        </CardContent>
      </Card>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No certificates yet</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Complete a course to earn your first certificate
            </p>
            <Button asChild>
              <Link href="/dashboard/my-courses">View My Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden">
              {/* Certificate Preview */}
              <div className="relative aspect-4/3 border-b bg-linear-to-br from-primary/10 via-primary/5 to-background">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Award className="mb-3 h-12 w-12 text-primary" />
                  <h3 className="mb-1 text-lg font-semibold">
                    Certificate of Completion
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {certificate.course.title}
                  </p>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline">
                    {certificate.course.category.name}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1 text-base">
                  {certificate.course.title}
                </CardTitle>
                <CardDescription>
                  Issued on{" "}
                  {format(new Date(certificate.issuedAt), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Certificate ID:{" "}
                  </span>
                  <span className="font-mono">{certificate.certificateId}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/certificates/${certificate.certificateId}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
