// ============================================
// Stats Section
// ============================================

import { Users, BookOpen, Award, Clock } from "lucide-react";

const stats = [
  {
    label: "Active Students",
    value: "10,000+",
    icon: Users,
    description: "Learning with us",
  },
  {
    label: "Courses",
    value: "50+",
    icon: BookOpen,
    description: "Premium content",
  },
  {
    label: "Certificates Issued",
    value: "5,000+",
    icon: Award,
    description: "Skills verified",
  },
  {
    label: "Hours of Content",
    value: "1,000+",
    icon: Clock,
    description: "Video lessons",
  },
];

export function StatsSection() {
  return (
    <section className="border-y bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
