// ============================================
// New Course Page (Manager/Owner)
// ============================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/actions/categories";
import { CourseForm } from "../_components/course-form";

export default async function NewCoursePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "owner" && session.user.role !== "manager") {
    redirect("/dashboard");
  }

  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new course
        </p>
      </div>

      <CourseForm categories={categories} />
    </div>
  );
}
