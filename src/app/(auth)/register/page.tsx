// ============================================
// Register Page
// ============================================

import { Suspense } from "react";
import { RegisterForm } from "./_components/register-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image/Branding */}
      <div className="hidden flex-1 items-center justify-center bg-muted p-8 lg:flex">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <GraduationCap className="mx-auto h-24 w-24 text-primary" />
          </div>
          <h2 className="mb-4 text-3xl font-bold">
            Join Our Learning Community
          </h2>
          <p className="text-muted-foreground">
            Get access to premium courses, track your progress, earn
            certificates, and transform your career with MohirLab.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 lg:hidden"
            >
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{APP_NAME}</span>
            </Link>
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="mt-2 text-muted-foreground">
              Start your learning journey today
            </p>
          </div>

          <Suspense>
            <RegisterForm />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
