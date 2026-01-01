// ============================================
// Privacy Policy Page
// ============================================

import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p className="mt-4 text-muted-foreground">
              MohirLab (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              2. Information We Collect
            </h2>
            <p className="mt-4 text-muted-foreground">
              We collect information that you provide directly to us:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Account information (name, email, password)</li>
              <li>Profile information (bio, profile picture)</li>
              <li>
                Payment information (processed securely by our payment
                providers)
              </li>
              <li>Course progress and completion data</li>
              <li>Communications with us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              3. How We Use Your Information
            </h2>
            <p className="mt-4 text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Improve our platform and develop new features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p className="mt-4 text-muted-foreground">
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              Internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
            <p className="mt-4 text-muted-foreground">You have the right to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">6. Contact Us</h2>
            <p className="mt-4 text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us
              at privacy@mohirlab.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
