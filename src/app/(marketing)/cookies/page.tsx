// ============================================
// Cookie Policy Page
// ============================================

import { Badge } from "@/components/ui/badge";

export default function CookiesPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">What Are Cookies</h2>
            <p className="mt-4 text-muted-foreground">
              Cookies are small text files stored on your device when you visit
              a website. They help us provide a better user experience by
              remembering your preferences and login status.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">How We Use Cookies</h2>
            <p className="mt-4 text-muted-foreground">We use cookies to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services based on usage data</li>
              <li>Provide relevant content and recommendations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold">Essential Cookies</h3>
                <p className="text-muted-foreground">
                  Required for the platform to function properly. Cannot be
                  disabled.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Analytics Cookies</h3>
                <p className="text-muted-foreground">
                  Help us understand how visitors interact with our platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Preference Cookies</h3>
                <p className="text-muted-foreground">
                  Remember your settings and preferences.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Managing Cookies</h2>
            <p className="mt-4 text-muted-foreground">
              You can control cookies through your browser settings. Note that
              disabling certain cookies may affect the functionality of our
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="mt-4 text-muted-foreground">
              If you have questions about our cookie policy, please contact us
              at privacy@mohirlab.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
