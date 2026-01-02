// ============================================
// Course Edit Page
// ============================================

import { notFound } from "next/navigation";
import { getAdminCourseById } from "@/actions/admin/courses";
import { getCategories } from "@/actions/categories";
import { CourseEditForm } from "./_components/course-edit-form";
import { CourseSections } from "./_components/course-sections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const { id } = await params;

  const [course, categoriesData] = await Promise.all([
    getAdminCourseById(id),
    getCategories(),
  ]);

  if (!course) {
    notFound();
  }

  const categories = categoriesData.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">
          Update course details and manage content
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <CourseEditForm course={course} categories={categories} />
        </TabsContent>

        <TabsContent value="content">
          <CourseSections course={course} />
        </TabsContent>

        <TabsContent value="settings">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium">Course Settings</h3>
            <p className="text-sm text-muted-foreground">
              Advanced settings and danger zone
            </p>
            {/* Settings content */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
