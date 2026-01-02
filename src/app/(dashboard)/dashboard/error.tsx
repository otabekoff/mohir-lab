"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  const isForbidden = error.message.includes("Forbidden");
  const isUnauthorized = error.message.includes("Unauthorized");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-lg border border-destructive/20 bg-destructive/5 p-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">
              {isForbidden || isUnauthorized
                ? "Access Denied"
                : "Something Went Wrong"}
            </h1>
            <p className="text-muted-foreground">
              {isForbidden
                ? "You do not have permission to access this resource. Only owners and managers can access this page."
                : isUnauthorized
                  ? "You need to be logged in to access this page."
                  : "An error occurred while loading this page. Please try again."}
            </p>
          </div>

          {process.env.NODE_ENV === "development" && error.message && (
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-xs wrap-break-word text-muted-foreground">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
            <Link href="/dashboard">
              <Button variant="default" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
