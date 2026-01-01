// ============================================
// FAQ Page
// ============================================

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is MohirLab?",
        answer:
          "MohirLab is an online learning platform offering high-quality tech courses. We provide practical, project-based learning experiences designed to help you build real-world skills and advance your career.",
      },
      {
        question: "How do I get started?",
        answer:
          "Simply create a free account, browse our course catalog, and enroll in any course that interests you. Many courses offer free preview lessons so you can try before you buy.",
      },
      {
        question: "Are the courses self-paced?",
        answer:
          "Yes! All our courses are self-paced, meaning you can learn at your own speed and on your own schedule. Once enrolled, you have lifetime access to the course materials.",
      },
    ],
  },
  {
    category: "Payments & Pricing",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and local payment methods in supported regions.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with a course, you can request a full refund within 30 days of purchase.",
      },
      {
        question: "Are there any discounts available?",
        answer:
          "We regularly offer promotional discounts. Sign up for our newsletter to be notified of sales. We also offer student discounts and team pricing for organizations.",
      },
    ],
  },
  {
    category: "Certificates",
    questions: [
      {
        question: "Do I get a certificate upon completion?",
        answer:
          "Yes! Upon completing a course, you'll receive a certificate of completion that you can share on LinkedIn, add to your resume, or print for your records.",
      },
      {
        question: "Are the certificates recognized by employers?",
        answer:
          "Our certificates demonstrate your commitment to learning and skill development. Many of our students have successfully used their certificates to land jobs and advance their careers.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        question: "Can I download videos for offline viewing?",
        answer:
          "Pro subscribers can download course videos for offline viewing on our mobile app. This feature is not available for free courses.",
      },
      {
        question: "What if I have technical issues?",
        answer:
          "Our support team is here to help! You can reach us through the contact page, and we typically respond within 24 hours.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">FAQ</Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about MohirLab
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="mb-4 text-xl font-semibold">{section.category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {section.questions.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`${section.category}-${index}`}
                >
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="mt-2 text-muted-foreground">
          Can&apos;t find the answer you&apos;re looking for? Reach out to our
          team.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
