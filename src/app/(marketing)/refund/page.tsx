// ============================================
// Refund Policy Page
// ============================================

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RefundPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              30-Day Money-Back Guarantee
            </h2>
            <p className="mt-4 text-muted-foreground">
              We want you to be completely satisfied with your purchase. If
              you&apos;re not happy with a course for any reason, you can
              request a full refund within 30 days of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Eligibility</h2>
            <p className="mt-4 text-muted-foreground">
              To be eligible for a refund:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Request must be made within 30 days of purchase</li>
              <li>You must not have completed more than 30% of the course</li>
              <li>You have not received a refund for this course before</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">How to Request a Refund</h2>
            <p className="mt-4 text-muted-foreground">
              To request a refund, please contact our support team with your
              order details. We typically process refunds within 5-7 business
              days.
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Go to your account settings</li>
              <li>Navigate to Order History</li>
              <li>Select the course you want refunded</li>
              <li>Click &quot;Request Refund&quot; and provide a reason</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Subscription Refunds</h2>
            <p className="mt-4 text-muted-foreground">
              For subscription plans, you may cancel at any time. You&apos;ll
              continue to have access until the end of your billing period.
              Refunds for partial months are not provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Exceptions</h2>
            <p className="mt-4 text-muted-foreground">
              Refunds may not be granted in cases of:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Abuse of the refund policy</li>
              <li>Violation of our Terms of Service</li>
              <li>
                Courses obtained through promotional offers marked as
                non-refundable
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Questions?</h2>
            <p className="mt-4 text-muted-foreground">
              If you have any questions about our refund policy, please
              don&apos;t hesitate to contact us.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
