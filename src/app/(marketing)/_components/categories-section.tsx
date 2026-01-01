// ============================================
// Categories Section
// ============================================

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Database,
  Smartphone,
  Brain,
  Palette,
  Shield,
  Cloud,
  LineChart,
} from "lucide-react";

const categories = [
  {
    name: "Web Development",
    slug: "web-development",
    icon: Code,
    coursesCount: 15,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Data Science",
    slug: "data-science",
    icon: Database,
    coursesCount: 12,
    color: "bg-green-500/10 text-green-500",
  },
  {
    name: "Mobile Development",
    slug: "mobile-development",
    icon: Smartphone,
    coursesCount: 8,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    name: "Machine Learning",
    slug: "machine-learning",
    icon: Brain,
    coursesCount: 10,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    icon: Palette,
    coursesCount: 6,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    icon: Shield,
    coursesCount: 5,
    color: "bg-red-500/10 text-red-500",
  },
  {
    name: "Cloud Computing",
    slug: "cloud-computing",
    icon: Cloud,
    coursesCount: 7,
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    name: "Business & Marketing",
    slug: "business-marketing",
    icon: LineChart,
    coursesCount: 9,
    color: "bg-yellow-500/10 text-yellow-600",
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect course for your learning goals
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/courses?category=${category.slug}`}
            >
              <Card className="group h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`rounded-lg p-3 ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.coursesCount} courses
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
