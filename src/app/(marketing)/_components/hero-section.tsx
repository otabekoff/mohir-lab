// ============================================
// Hero Section
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-background to-muted/20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Sparkles className="h-3 w-3" />
            New courses added weekly
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Master New Skills with{" "}
            <span className="text-primary">Premium Courses</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Learn from industry experts and advance your career with our
            carefully crafted courses. From beginner to advanced, we have
            something for everyone.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/courses">
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link href="/about">
                <Play className="h-4 w-4" />
                Watch How It Works
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <span>10,000+ students</span>
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <span className="text-yellow-500">★★★★★</span>
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
