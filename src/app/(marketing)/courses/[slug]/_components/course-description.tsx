// ============================================
// Course Description Component
// ============================================

interface CourseDescriptionProps {
  description: string;
}

export function CourseDescription({ description }: CourseDescriptionProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">About This Course</h2>
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </section>
  );
}
