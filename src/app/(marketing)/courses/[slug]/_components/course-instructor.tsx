// ============================================
// Course Instructor Component
// ============================================

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, PlayCircle, Award } from "lucide-react";

interface CourseInstructorProps {
  instructor: string;
}

export function CourseInstructor({ instructor }: CourseInstructorProps) {
  // In production, this would fetch instructor data from API
  const instructorData = {
    name: instructor,
    title: "Senior Software Engineer & Instructor",
    image: "/instructors/alex.jpg",
    bio: "Alex is a senior software engineer with over 10 years of experience building web applications. He has worked at top tech companies and has a passion for teaching and helping others learn to code.",
    rating: 4.9,
    reviewsCount: 12500,
    studentsCount: 45000,
    coursesCount: 8,
  };

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Your Instructor</h2>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={instructorData.image}
                alt={instructorData.name}
              />
              <AvatarFallback className="text-2xl">
                {instructorData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{instructorData.name}</h3>
              <p className="text-muted-foreground">{instructorData.title}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{instructorData.rating}</span>
                  <span className="text-muted-foreground">
                    Instructor Rating
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>
                    {instructorData.reviewsCount.toLocaleString()} Reviews
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {instructorData.studentsCount.toLocaleString()} Students
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <PlayCircle className="h-4 w-4" />
                  <span>{instructorData.coursesCount} Courses</span>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground">{instructorData.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
