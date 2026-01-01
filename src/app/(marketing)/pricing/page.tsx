// ============================================
// Pricing Page
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for exploring our platform",
    price: 0,
    period: "forever",
    features: [
      "Access to free courses",
      "Community forum access",
      "Basic certificates",
      "Email support",
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    description: "Best for serious learners",
    price: 19,
    period: "month",
    features: [
      "Everything in Free",
      "Access to all courses",
      "Verified certificates",
      "Priority support",
      "Downloadable resources",
      "Offline viewing",
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Team",
    description: "For organizations and teams",
    price: 49,
    period: "user/month",
    features: [
      "Everything in Pro",
      "Team management",
      "Progress tracking",
      "Custom learning paths",
      "API access",
      "Dedicated account manager",
      "SSO integration",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that&apos;s right for you
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 pt-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="relative">
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <Card
              className={`flex h-full flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-2 text-muted-foreground">
          Have questions?{" "}
          <Link href="/faq" className="text-primary hover:underline">
            Check our FAQ
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
