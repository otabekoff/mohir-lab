// ============================================
// Terms of Service Page
// ============================================

import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-4 text-muted-foreground">
              By accessing or using MohirLab, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">2. Use of Service</h2>
            <p className="mt-4 text-muted-foreground">
              You may use our platform only for lawful purposes and in
              accordance with these Terms. You agree not to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Share your account credentials with others</li>
              <li>Download or redistribute course content</li>
              <li>Use automated systems to access our platform</li>
              <li>Interfere with the proper working of our service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">3. Accounts</h2>
            <p className="mt-4 text-muted-foreground">
              You are responsible for maintaining the confidentiality of your
              account and password. You agree to accept responsibility for all
              activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">4. Payments and Refunds</h2>
            <p className="mt-4 text-muted-foreground">
              Course purchases are subject to our refund policy. We offer a
              30-day money-back guarantee for most courses. Subscription fees
              are non-refundable after the trial period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
            <p className="mt-4 text-muted-foreground">
              All course content, including videos, text, and materials, is
              owned by MohirLab or our instructors and is protected by copyright
              laws. You may not reproduce, distribute, or create derivative
              works without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              6. Limitation of Liability
            </h2>
            <p className="mt-4 text-muted-foreground">
              MohirLab shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of our
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">7. Changes to Terms</h2>
            <p className="mt-4 text-muted-foreground">
              We reserve the right to modify these terms at any time. We will
              notify users of significant changes via email or platform
              notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">8. Contact</h2>
            <p className="mt-4 text-muted-foreground">
              For questions about these Terms, please contact us at
              legal@mohirlab.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
