// ============================================
// CTA Section
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Start Learning Today</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Transform Your Career?
          </h2>

          <p className="mt-6 text-lg text-primary-foreground/80">
            Join over 10,000 students who have already started their learning
            journey with MohirLab. Get instant access to all our courses and
            start building your future today.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="w-full gap-2 sm:w-auto"
            >
              <Link href="/courses">
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full gap-2 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/60">
            No credit card required. Start with free lessons today.
          </p>
        </div>
      </div>
    </section>
  );
}
