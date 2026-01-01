// ============================================
// Features Section
// ============================================

import {
  GraduationCap,
  Infinity,
  Code,
  Award,
  Users,
  Smartphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Expert Instructors",
    description:
      "Learn from industry professionals with years of real-world experience.",
    icon: GraduationCap,
  },
  {
    title: "Lifetime Access",
    description:
      "Once enrolled, access your courses forever with all future updates included.",
    icon: Infinity,
  },
  {
    title: "Practical Projects",
    description:
      "Build real-world projects to strengthen your portfolio and skills.",
    icon: Code,
  },
  {
    title: "Certificate of Completion",
    description:
      "Earn certificates to showcase your achievements to employers.",
    icon: Award,
  },
  {
    title: "Community Support",
    description:
      "Join our community of learners and get help when you need it.",
    icon: Users,
  },
  {
    title: "Mobile Friendly",
    description: "Learn on the go with our mobile-optimized video player.",
    icon: Smartphone,
  },
];

export function FeaturesSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Why Choose MohirLab?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          We provide everything you need to succeed in your learning journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-2 transition-colors hover:border-primary/50"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
