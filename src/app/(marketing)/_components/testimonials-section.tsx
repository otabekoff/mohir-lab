// ============================================
// Testimonials Section
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: "1",
    name: "Aziz Karimov",
    role: "Frontend Developer",
    company: "Tech Corp",
    image: "https://i.pravatar.cc/150?u=aziz",
    content:
      "MohirLab's courses transformed my career. The practical approach and real-world projects helped me land my dream job. I went from knowing basic HTML to building complex React applications in just 4 months.",
    rating: 5,
  },
  {
    id: "2",
    name: "Malika Usmanova",
    role: "Full Stack Developer",
    company: "Startup Inc",
    image: "https://i.pravatar.cc/150?u=malika",
    content:
      "The quality of instruction is outstanding. I went from beginner to professional in just 6 months. The instructors explain complex concepts in a way that is easy to understand.",
    rating: 5,
  },
  {
    id: "3",
    name: "Sardor Tursunov",
    role: "Data Scientist",
    company: "Analytics Pro",
    image: "https://i.pravatar.cc/150?u=sardor",
    content:
      "Best investment in my education. The structured curriculum and expert instructors made complex topics easy to understand. I now work with machine learning models daily.",
    rating: 5,
  },
  {
    id: "4",
    name: "Nodira Alimova",
    role: "Backend Developer",
    company: "FinTech Solutions",
    image: "https://i.pravatar.cc/150?u=nodira",
    content:
      "The courses are well-structured and the projects are incredibly practical. I built a production-ready API during the course that I still use as a reference today.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          What Our Students Say
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of satisfied learners who transformed their careers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardContent className="p-6">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-muted-foreground/20" />

              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="relative z-10 mb-6 text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
