'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Student Not Found</h1>
            <p className="text-muted-foreground">
              The student record you are looking for does not exist.
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/dashboard/students">
              <Button variant="default" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Students
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
