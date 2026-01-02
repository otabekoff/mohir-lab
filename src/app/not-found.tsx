// ============================================
// Custom 404 Not Found Page
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted/20 px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <span className="text-[12rem] leading-none font-bold text-muted/20 md:text-[16rem]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl bg-primary/10 p-6">
              <BookOpen className="h-16 w-16 text-primary md:h-24 md:w-24" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/courses">
              <Search className="h-4 w-4" />
              Browse Courses
            </Link>
          </Button>
        </div>

        {/* Go Back */}
        <div className="mt-8">
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to previous page
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  );
}
