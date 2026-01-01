// ============================================
// About Page
// ============================================

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Heart, Users, BookOpen, Award } from "lucide-react";

const stats = [
  { label: "Students", value: "10,000+", icon: Users },
  { label: "Courses", value: "50+", icon: BookOpen },
  { label: "Certificates Issued", value: "5,000+", icon: Award },
];

const team = [
  {
    name: "Otabek Ismoilov",
    role: "Founder & CEO",
    image: "https://i.pravatar.cc/300?u=otabek",
    bio: "Full-stack developer with 10+ years of experience building scalable applications.",
  },
  {
    name: "Aziza Karimova",
    role: "Head of Education",
    image: "https://i.pravatar.cc/300?u=aziza",
    bio: "Former university professor passionate about making education accessible.",
  },
  {
    name: "Sardor Rahimov",
    role: "Lead Instructor",
    image: "https://i.pravatar.cc/300?u=sardor",
    bio: "Senior engineer specializing in cloud architecture and DevOps.",
  },
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We believe quality education should be accessible to everyone, everywhere.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "To become the leading platform for tech education in Central Asia and beyond.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "We're passionate about helping students achieve their career goals.",
  },
];

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <Badge className="mb-4">About Us</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Empowering the Next Generation of Developers
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          MohirLab was founded with a simple mission: to provide world-class
          tech education that is accessible, practical, and career-focused.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-16 grid gap-8 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <Icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Team</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name}>
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            MohirLab started in 2024 with a vision to bridge the gap between
            traditional education and the rapidly evolving tech industry. We
            noticed that many talented individuals lacked access to quality,
            up-to-date programming education.
          </p>
          <p>
            Today, we&apos;re proud to have helped thousands of students
            transform their careers. Our courses are designed by industry
            professionals who bring real-world experience to every lesson.
          </p>
          <p>
            We&apos;re just getting started. Join us on this journey to make
            tech education accessible to everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
