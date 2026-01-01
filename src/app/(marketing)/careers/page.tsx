// ============================================
// Careers Page
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase } from "lucide-react";

const positions = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "We're looking for an experienced frontend developer to help build our next-generation learning platform.",
  },
  {
    id: "2",
    title: "Content Creator / Instructor",
    department: "Education",
    location: "Remote",
    type: "Contract",
    description:
      "Create engaging course content and teach students the skills they need to succeed in tech.",
  },
  {
    id: "3",
    title: "Product Designer",
    department: "Design",
    location: "Tashkent / Remote",
    type: "Full-time",
    description:
      "Design beautiful and intuitive user experiences for our learning platform.",
  },
  {
    id: "4",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Tashkent",
    type: "Full-time",
    description:
      "Lead our marketing efforts and help us reach more students across the region.",
  },
];

const benefits = [
  "Competitive salary & equity",
  "Remote-first culture",
  "Flexible working hours",
  "Professional development budget",
  "Health insurance",
  "Unlimited PTO",
];

export default function CareersPage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">Careers</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Join Our Team</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Help us transform tech education and make a difference
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-16">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Why Work With Us
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{benefit}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className="mb-6 text-center text-2xl font-bold">Open Positions</h2>
        <div className="space-y-4">
          {positions.map((position) => (
            <Card key={position.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>{position.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {position.department}
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/careers/${position.id}`}>Apply Now</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {position.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{position.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{position.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Posted recently</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold">Don&apos;t see your role?</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;re always looking for talented people. Send us your resume!
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  );
}
