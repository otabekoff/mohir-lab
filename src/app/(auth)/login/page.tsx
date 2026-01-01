// ============================================
// Login Page
// ============================================

import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="mb-8 inline-flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{APP_NAME}</span>
            </Link>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden flex-1 items-center justify-center bg-muted p-8 lg:flex">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <GraduationCap className="mx-auto h-24 w-24 text-primary" />
          </div>
          <h2 className="mb-4 text-3xl font-bold">Start Learning Today</h2>
          <p className="text-muted-foreground">
            Access your courses, track your progress, and achieve your learning
            goals with MohirLab.
          </p>
        </div>
      </div>
    </div>
  );
}
