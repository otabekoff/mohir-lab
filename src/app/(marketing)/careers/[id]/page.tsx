// ============================================
// Career Position Detail Page
// ============================================

import { notFound } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign } from "lucide-react";

interface CareerPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock positions data
const positions: Record<
  string,
  {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
  }
> = {
  "1": {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    description:
      "We're looking for an experienced frontend developer to help build our next-generation learning platform. You'll work closely with our design and backend teams to create beautiful, performant user interfaces.",
    responsibilities: [
      "Develop and maintain our Next.js-based learning platform",
      "Collaborate with designers to implement pixel-perfect UI components",
      "Write clean, maintainable, and well-tested code",
      "Participate in code reviews and mentor junior developers",
      "Contribute to technical decisions and architecture discussions",
    ],
    requirements: [
      "5+ years of experience in frontend development",
      "Strong proficiency in React and Next.js",
      "Experience with TypeScript and modern CSS",
      "Familiarity with testing frameworks (Jest, Cypress)",
      "Excellent communication skills",
    ],
    benefits: [
      "Competitive salary and equity",
      "Remote-first culture",
      "Flexible working hours",
      "Professional development budget",
      "Health insurance",
      "Unlimited PTO",
    ],
  },
  "2": {
    id: "2",
    title: "Content Creator / Instructor",
    department: "Education",
    location: "Remote",
    type: "Contract",
    salary: "Project-based",
    description:
      "Create engaging course content and teach students the skills they need to succeed in tech. We're looking for experts who can break down complex topics into easy-to-understand lessons.",
    responsibilities: [
      "Create comprehensive course curricula",
      "Record high-quality video lessons",
      "Develop projects and assignments for students",
      "Respond to student questions and feedback",
      "Keep course content up-to-date with industry changes",
    ],
    requirements: [
      "Expert-level knowledge in your subject area",
      "Previous teaching or content creation experience",
      "Excellent verbal and written communication",
      "Ability to explain complex concepts simply",
      "Self-motivated and organized",
    ],
    benefits: [
      "Revenue sharing on course sales",
      "Creative freedom in course design",
      "Access to our production team",
      "Promotion to our student community",
      "Flexible schedule",
    ],
  },
  "3": {
    id: "3",
    title: "Product Designer",
    department: "Design",
    location: "Tashkent / Remote",
    type: "Full-time",
    salary: "$60,000 - $90,000",
    description:
      "Design beautiful and intuitive user experiences for our learning platform. You'll work on everything from new feature concepts to polished UI designs.",
    responsibilities: [
      "Design user interfaces for web and mobile platforms",
      "Create wireframes, prototypes, and high-fidelity mockups",
      "Conduct user research and usability testing",
      "Maintain and evolve our design system",
      "Collaborate with engineers to ensure quality implementation",
    ],
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma and prototyping tools",
      "Strong portfolio demonstrating UI/UX skills",
      "Experience with design systems",
      "Understanding of accessibility standards",
    ],
    benefits: [
      "Competitive salary",
      "Remote or hybrid work options",
      "Latest design tools and equipment",
      "Conference and training budget",
      "Health insurance",
    ],
  },
  "4": {
    id: "4",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Tashkent",
    type: "Full-time",
    salary: "$50,000 - $70,000",
    description:
      "Lead our marketing efforts and help us reach more students across the region. You'll develop and execute marketing strategies across multiple channels.",
    responsibilities: [
      "Develop and execute marketing strategies",
      "Manage social media and content marketing",
      "Analyze marketing metrics and optimize campaigns",
      "Collaborate with the sales team on lead generation",
      "Build partnerships with educational institutions",
    ],
    requirements: [
      "4+ years of marketing experience",
      "Experience with digital marketing channels",
      "Strong analytical and data-driven mindset",
      "Excellent communication skills in English and Uzbek",
      "Experience in EdTech is a plus",
    ],
    benefits: [
      "Competitive salary",
      "Marketing budget for experimentation",
      "Professional development opportunities",
      "Team events and activities",
      "Health insurance",
    ],
  },
};

export default async function CareerPositionPage({ params }: CareerPageProps) {
  const { id } = await params;
  const position = positions[id];

  if (!position) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/careers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-8">
          <Badge className="mb-4">{position.department}</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            {position.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{position.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>{position.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{position.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Posted recently</span>
            </div>
          </div>
        </header>

        <Separator className="mb-8" />

        {/* Description */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">About the Role</h2>
          <p className="text-muted-foreground">{position.description}</p>
        </section>

        {/* Responsibilities */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Responsibilities</h2>
          <ul className="space-y-2">
            {position.responsibilities.map((item, index) => (
              <li key={index} className="flex gap-2 text-muted-foreground">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Requirements */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Requirements</h2>
          <ul className="space-y-2">
            {position.requirements.map((item, index) => (
              <li key={index} className="flex gap-2 text-muted-foreground">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Benefits */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Benefits</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {position.benefits.map((item, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-2 p-4">
                  <span className="text-primary">✓</span>
                  {item}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="mb-8" />

        {/* Apply Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Apply?</CardTitle>
            <CardDescription>
              Send us your resume and a brief cover letter explaining why
              you&apos;d be a great fit for this role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="flex-1" asChild>
                <Link
                  href={`mailto:careers@mohirlab.com?subject=Application for ${position.title}`}
                >
                  Apply via Email
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
