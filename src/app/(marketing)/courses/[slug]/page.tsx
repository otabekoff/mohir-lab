// ============================================
// Course Detail Page
// ============================================

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CourseHeader } from "./_components/course-header";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseCurriculum } from "./_components/course-curriculum";
import { CourseDescription } from "./_components/course-description";
import { CourseReviews } from "./_components/course-reviews";
import { CourseInstructor } from "./_components/course-instructor";
import { RelatedCourses } from "./_components/related-courses";
import { Skeleton } from "@/components/ui/skeleton";
import type { Course } from "@/types";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Mock courses database - in production, this would be an API call
const mockCoursesDB: Record<string, Course> = {
  "complete-web-development-bootcamp-2026": {
    id: "1",
    title: "Complete Web Development Bootcamp 2026",
    slug: "complete-web-development-bootcamp-2026",
    description: `
      <h2>Master Full-Stack Web Development</h2>
      <p>This comprehensive bootcamp will take you from absolute beginner to professional web developer. You'll learn everything you need to build modern, responsive web applications.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>HTML5, CSS3, and modern JavaScript (ES6+)</li>
        <li>React 19 with hooks and modern patterns</li>
        <li>Next.js 16 for production applications</li>
        <li>Node.js and Express.js backend development</li>
        <li>PostgreSQL and Prisma ORM</li>
        <li>Authentication and security best practices</li>
        <li>Deployment to Vercel, AWS, and Docker</li>
      </ul>
      
      <h3>Requirements</h3>
      <ul>
        <li>No prior programming experience needed</li>
        <li>A computer with internet access</li>
        <li>Dedication to learn and practice</li>
      </ul>
      
      <h3>Who This Course Is For</h3>
      <ul>
        <li>Complete beginners who want to become web developers</li>
        <li>Self-taught programmers looking to fill gaps</li>
        <li>Bootcamp graduates wanting to deepen their knowledge</li>
        <li>Anyone looking to transition into tech</li>
      </ul>
    `,
    shortDescription:
      "Master full-stack web development from scratch with hands-on projects.",
    thumbnail: "https://picsum.photos/seed/webdev/800/450",
    price: 99.99,
    discountPrice: 49.99,
    level: "beginner",
    category: {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      coursesCount: 15,
    },
    categoryId: "1",
    instructor: "Alex Johnson",
    duration: 4200,
    lessonsCount: 320,
    studentsCount: 15420,
    rating: 4.8,
    reviewsCount: 3250,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "s1",
        title: "Getting Started",
        order: 1,
        lessons: [
          {
            id: "l1",
            title: "Welcome to the Course",
            videoUrl: "",
            duration: 180,
            order: 1,
            isFree: true,
          },
          {
            id: "l2",
            title: "Setting Up Your Development Environment",
            videoUrl: "",
            duration: 900,
            order: 2,
            isFree: true,
          },
          {
            id: "l3",
            title: "How the Web Works",
            videoUrl: "",
            duration: 720,
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        id: "s2",
        title: "HTML Fundamentals",
        order: 2,
        lessons: [
          {
            id: "l4",
            title: "Introduction to HTML",
            videoUrl: "",
            duration: 600,
            order: 1,
            isFree: false,
          },
          {
            id: "l5",
            title: "HTML Document Structure",
            videoUrl: "",
            duration: 480,
            order: 2,
            isFree: false,
          },
          {
            id: "l6",
            title: "Working with Text Elements",
            videoUrl: "",
            duration: 540,
            order: 3,
            isFree: false,
          },
        ],
      },
    ],
  },
  "python-data-science-machine-learning": {
    id: "2",
    title: "Python for Data Science & Machine Learning",
    slug: "python-data-science-machine-learning",
    description: `
      <h2>Become a Data Scientist</h2>
      <p>Master Python and machine learning to analyze data, build predictive models, and unlock insights from your data.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Python programming from basics to advanced</li>
        <li>Data manipulation with Pandas and NumPy</li>
        <li>Data visualization with Matplotlib and Seaborn</li>
        <li>Machine Learning with Scikit-learn</li>
        <li>Deep Learning with TensorFlow and PyTorch</li>
        <li>Real-world projects and case studies</li>
      </ul>
      
      <h3>Requirements</h3>
      <ul>
        <li>Basic programming knowledge helpful but not required</li>
        <li>High school math (algebra, basic statistics)</li>
        <li>Willingness to practice and experiment</li>
      </ul>
    `,
    shortDescription:
      "Become a data scientist with Python. Learn ML algorithms and data analysis.",
    thumbnail: "https://picsum.photos/seed/python/800/450",
    price: 129.99,
    level: "intermediate",
    category: {
      id: "2",
      name: "Data Science",
      slug: "data-science",
      coursesCount: 12,
    },
    categoryId: "2",
    instructor: "Sarah Williams",
    duration: 3600,
    lessonsCount: 280,
    studentsCount: 12350,
    rating: 4.9,
    reviewsCount: 2890,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "s1",
        title: "Python Basics",
        order: 1,
        lessons: [
          {
            id: "l1",
            title: "Introduction to Python",
            videoUrl: "",
            duration: 600,
            order: 1,
            isFree: true,
          },
          {
            id: "l2",
            title: "Variables and Data Types",
            videoUrl: "",
            duration: 720,
            order: 2,
            isFree: true,
          },
          {
            id: "l3",
            title: "Control Flow",
            videoUrl: "",
            duration: 540,
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        id: "s2",
        title: "Data Analysis with Pandas",
        order: 2,
        lessons: [
          {
            id: "l4",
            title: "Introduction to Pandas",
            videoUrl: "",
            duration: 600,
            order: 1,
            isFree: false,
          },
          {
            id: "l5",
            title: "DataFrames and Series",
            videoUrl: "",
            duration: 720,
            order: 2,
            isFree: false,
          },
        ],
      },
    ],
  },
  "advanced-react-nextjs-masterclass": {
    id: "3",
    title: "Advanced React & Next.js Masterclass",
    slug: "advanced-react-nextjs-masterclass",
    description: `
      <h2>Master Modern React Development</h2>
      <p>Take your React skills to the next level with advanced patterns, performance optimization, and production-ready Next.js applications.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Advanced React patterns (HOCs, Render Props, Compound Components)</li>
        <li>React 19 features including React Compiler</li>
        <li>Next.js 16 App Router and Server Components</li>
        <li>State management with Zustand and TanStack Query</li>
        <li>Authentication and authorization</li>
        <li>Testing with Vitest and Playwright</li>
        <li>Deployment and CI/CD pipelines</li>
      </ul>
      
      <h3>Requirements</h3>
      <ul>
        <li>Solid understanding of React fundamentals</li>
        <li>Experience with JavaScript/TypeScript</li>
        <li>Familiarity with REST APIs</li>
      </ul>
    `,
    shortDescription:
      "Take your React skills to the next level with advanced patterns and Next.js.",
    thumbnail: "https://picsum.photos/seed/react/800/450",
    price: 149.99,
    discountPrice: 79.99,
    level: "advanced",
    category: {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      coursesCount: 15,
    },
    categoryId: "1",
    instructor: "Michael Chen",
    duration: 2400,
    lessonsCount: 180,
    studentsCount: 8920,
    rating: 4.9,
    reviewsCount: 1560,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "s1",
        title: "Advanced React Patterns",
        order: 1,
        lessons: [
          {
            id: "l1",
            title: "Higher-Order Components",
            videoUrl: "",
            duration: 720,
            order: 1,
            isFree: true,
          },
          {
            id: "l2",
            title: "Render Props Pattern",
            videoUrl: "",
            duration: 600,
            order: 2,
            isFree: true,
          },
          {
            id: "l3",
            title: "Compound Components",
            videoUrl: "",
            duration: 840,
            order: 3,
            isFree: false,
          },
        ],
      },
      {
        id: "s2",
        title: "Next.js Deep Dive",
        order: 2,
        lessons: [
          {
            id: "l4",
            title: "App Router Architecture",
            videoUrl: "",
            duration: 900,
            order: 1,
            isFree: false,
          },
          {
            id: "l5",
            title: "Server Components vs Client Components",
            videoUrl: "",
            duration: 720,
            order: 2,
            isFree: false,
          },
        ],
      },
    ],
  },
  "mobile-app-development-react-native": {
    id: "4",
    title: "Mobile App Development with React Native",
    slug: "mobile-app-development-react-native",
    description: `
      <h2>Build Cross-Platform Mobile Apps</h2>
      <p>Create beautiful, native mobile applications for iOS and Android using React Native and Expo.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>React Native fundamentals and architecture</li>
        <li>Expo for rapid development</li>
        <li>Navigation with React Navigation</li>
        <li>State management and data fetching</li>
        <li>Native device features (camera, location, etc.)</li>
        <li>App Store and Play Store deployment</li>
      </ul>
    `,
    shortDescription:
      "Create cross-platform mobile applications with React Native and Expo.",
    thumbnail: "https://picsum.photos/seed/mobile/800/450",
    price: 119.99,
    level: "intermediate",
    category: {
      id: "3",
      name: "Mobile Development",
      slug: "mobile-development",
      coursesCount: 8,
    },
    categoryId: "3",
    instructor: "Emily Zhang",
    duration: 2800,
    lessonsCount: 200,
    studentsCount: 6540,
    rating: 4.7,
    reviewsCount: 980,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "s1",
        title: "Getting Started with React Native",
        order: 1,
        lessons: [
          {
            id: "l1",
            title: "Introduction to React Native",
            videoUrl: "",
            duration: 600,
            order: 1,
            isFree: true,
          },
          {
            id: "l2",
            title: "Setting Up Expo",
            videoUrl: "",
            duration: 480,
            order: 2,
            isFree: true,
          },
        ],
      },
    ],
  },
  "ui-ux-design-fundamentals": {
    id: "5",
    title: "UI/UX Design Fundamentals",
    slug: "ui-ux-design-fundamentals",
    description: `
      <h2>Master User Interface and Experience Design</h2>
      <p>Learn the principles of great design and create beautiful, user-friendly interfaces.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Design principles and theory</li>
        <li>Figma from beginner to advanced</li>
        <li>User research and personas</li>
        <li>Wireframing and prototyping</li>
        <li>Design systems and components</li>
        <li>Usability testing</li>
      </ul>
    `,
    shortDescription:
      "Master the fundamentals of UI/UX design and create beautiful interfaces.",
    thumbnail: "https://picsum.photos/seed/design/800/450",
    price: 89.99,
    level: "beginner",
    category: {
      id: "5",
      name: "UI/UX Design",
      slug: "ui-ux-design",
      coursesCount: 10,
    },
    categoryId: "5",
    instructor: "Lisa Park",
    duration: 1800,
    lessonsCount: 120,
    studentsCount: 4230,
    rating: 4.8,
    reviewsCount: 720,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "s1",
        title: "Design Fundamentals",
        order: 1,
        lessons: [
          {
            id: "l1",
            title: "Introduction to Design",
            videoUrl: "",
            duration: 600,
            order: 1,
            isFree: true,
          },
          {
            id: "l2",
            title: "Color Theory",
            videoUrl: "",
            duration: 720,
            order: 2,
            isFree: true,
          },
        ],
      },
    ],
  },
  "devops-cloud-engineering": {
    id: "6",
    title: "DevOps & Cloud Engineering",
    slug: "devops-cloud-engineering",
    description: `
      <h2>Master DevOps and Cloud Infrastructure</h2>
      <p>Learn modern DevOps practices and cloud infrastructure management with AWS, Docker, and Kubernetes.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Linux and shell scripting</li>
        <li>Docker and containerization</li>
        <li>Kubernetes orchestration</li>
        <li>AWS cloud services</li>
        <li>CI/CD pipelines with GitHub Actions</li>
        <li>Infrastructure as Code with Terraform</li>
      </ul>
    `,
    shortDescription:
      "Learn modern DevOps practices and cloud infrastructure management.",
    thumbnail: "https://picsum.photos/seed/devops/800/450",
    price: 159.99,
    level: "advanced",
    category: {
      id: "4",
      name: "Cloud Computing",
      slug: "cloud-computing",
      coursesCount: 6,
    },
    categoryId: "4",
    instructor: "David Kim",
    duration: 3200,
    lessonsCount: 220,
    studentsCount: 5120,
    rating: 4.9,
    reviewsCount: 890,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "s1",
        title: "DevOps Fundamentals",
        order: 1,
        lessons: [
          {
            id: "l1",
            title: "What is DevOps?",
            videoUrl: "",
            duration: 600,
            order: 1,
            isFree: true,
          },
          {
            id: "l2",
            title: "Linux Essentials",
            videoUrl: "",
            duration: 900,
            order: 2,
            isFree: true,
          },
        ],
      },
    ],
  },
};

async function getCourse(slug: string): Promise<Course | null> {
  // In production, this would be an API call
  return mockCoursesDB[slug] || null;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <CourseHeader course={course} />

      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            <CourseDescription description={course.description} />
            <CourseCurriculum sections={course.sections} />
            <CourseInstructor instructor={course.instructor} />
            <Suspense fallback={<Skeleton className="h-96" />}>
              <CourseReviews
                rating={course.rating}
                reviewsCount={course.reviewsCount}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar course={course} />
          </div>
        </div>

        <Suspense fallback={<Skeleton className="mt-12 h-96" />}>
          <RelatedCourses
            categoryId={course.categoryId}
            currentCourseId={course.id}
          />
        </Suspense>
      </div>
    </div>
  );
}
