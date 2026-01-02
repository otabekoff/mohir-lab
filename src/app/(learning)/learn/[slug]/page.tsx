// ============================================
// Course Learning Page
// ============================================

import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { getCourseForLearning } from "@/actions/courses";
import { isEnrolledBySlug, getEnrollmentBySlug, getLessonProgress, getCourseLessonProgress } from "@/actions/enrollments";
import { LearningPlayer } from "./_components/learning-player";
import { LearningSidebar } from "./_components/learning-sidebar";
import { LearningHeader } from "./_components/learning-header";

interface LearnPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function LearnPage({
  params,
  searchParams,
}: LearnPageProps) {
  const { slug } = await params;
  const { lesson: lessonId } = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/learn/${slug}`);
  }

  // Check if user is enrolled
  const enrolled = await isEnrolledBySlug(slug);

  if (!enrolled) {
    redirect(`/courses/${slug}?error=not-enrolled`);
  }

  // Get course data with video URLs (only available for enrolled users)
  const course = await getCourseForLearning(slug);

  if (!course) {
    notFound();
  }

  // Convert Decimal fields to numbers for client components
  const courseData = {
    ...course,
    price: Number(course.price),
    discountPrice: course.discountPrice ? Number(course.discountPrice) : null,
  };

  // Get enrollment data for progress
  const [enrollment, allLessonProgress] = await Promise.all([
    getEnrollmentBySlug(slug),
    getCourseLessonProgress(course.id),
  ]);

  // Find current lesson
  let currentLesson = null;
  let currentSection = null;

  if (lessonId) {
    for (const section of courseData.sections) {
      const foundLesson = section.lessons.find((l) => l.id === lessonId);
      if (foundLesson) {
        currentLesson = foundLesson;
        currentSection = section;
        break;
      }
    }
  }

  // Default to first lesson if no lesson specified
  if (!currentLesson && courseData.sections.length > 0) {
    currentSection = courseData.sections[0];
    if (currentSection.lessons.length > 0) {
      currentLesson = currentSection.lessons[0];
    }
  }

  // Get lesson progress
  let isLessonCompleted = false;
  if (currentLesson) {
    const lessonProgress = await getLessonProgress(currentLesson.id);
    isLessonCompleted = lessonProgress?.isCompleted ?? false;
  }

  return (
    <div className="flex h-screen flex-col">
      <LearningHeader
        course={courseData}
        progress={enrollment?.progress || 0}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Video Player Area */}
        <div className="flex-1 overflow-auto">
          <LearningPlayer 
            lesson={currentLesson} 
            isCompleted={isLessonCompleted}
          />
        </div>

        {/* Sidebar with lessons */}
        <LearningSidebar
          course={courseData}
          currentLessonId={currentLesson?.id}
          enrollment={enrollment}
          lessonProgress={allLessonProgress}
        />
      </div>
    </div>
  );
}
