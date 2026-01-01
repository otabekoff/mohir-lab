// ============================================
// Categories Page
// ============================================

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Database,
  Smartphone,
  Palette,
  Brain,
  Cloud,
  Shield,
  TrendingUp,
} from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Web Development",
    slug: "web-development",
    description: "Build modern websites and web applications",
    icon: Code,
    coursesCount: 15,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "2",
    name: "Data Science",
    slug: "data-science",
    description: "Analyze data and build ML models",
    icon: Database,
    coursesCount: 12,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: "3",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Create iOS and Android applications",
    icon: Smartphone,
    coursesCount: 8,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "4",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "Design beautiful user interfaces",
    icon: Palette,
    coursesCount: 6,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    id: "5",
    name: "Machine Learning",
    slug: "machine-learning",
    description: "Build intelligent systems with AI",
    icon: Brain,
    coursesCount: 10,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "6",
    name: "Cloud Computing",
    slug: "cloud-computing",
    description: "Master AWS, Azure, and GCP",
    icon: Cloud,
    coursesCount: 7,
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    id: "7",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Protect systems and data",
    icon: Shield,
    coursesCount: 5,
    color: "bg-red-500/10 text-red-500",
  },
  {
    id: "8",
    name: "Business & Marketing",
    slug: "business-marketing",
    description: "Grow your business skills",
    icon: TrendingUp,
    coursesCount: 9,
    color: "bg-yellow-500/10 text-yellow-500",
  },
];

export default function CategoriesPage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Course Categories</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore our diverse range of courses across different domains
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.id} href={`/courses?category=${category.slug}`}>
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader>
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${category.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {category.name}
                    <Badge variant="secondary">{category.coursesCount}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
