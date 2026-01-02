// ============================================
// MohirLab Type Definitions
// ============================================

// User Roles for RBAC
export type UserRole = "owner" | "manager" | "customer";

// User related types
export interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile extends User {
    bio?: string;
    enrolledCourses: CourseEnrollment[];
    completedLessons: string[];
}

// Course related types
export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    previewVideo?: string;
    price: number;
    discountPrice?: number;
    level: CourseLevel;
    category: Category;
    categoryId: string;
    instructor: string;
    duration: number; // in minutes
    lessonsCount: number;
    studentsCount: number;
    rating: number;
    reviewsCount: number;
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
    sections: CourseSection[];
}

export type CourseLevel =
    | "beginner"
    | "intermediate"
    | "advanced"
    | "all_levels";

export interface CourseSection {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

// Lesson Types
export type LessonType =
    | "video" // 🎥 Video Lesson
    | "text" // 📝 Text/Article
    | "quiz" // ❓ Quiz/Test
    | "assignment" // 📂 Assignment/Homework
    | "coding" // 💻 Coding Exercise
    | "project" // 🧪 Project/Case Study
    | "task" // 🎯 Task/Challenge
    | "exam" // 📊 Exam/Final Test
    | "milestone" // 🏁 Milestone/Checkpoint
    | "discussion" // 💬 Discussion/Q&A
    | "announcement" // 📢 Announcement
    | "survey" // 🧠 Reflection/Survey
    | "resource" // 📎 Downloadable Resource
    | "external" // 🔗 External Resource
    | "live" // 📺 Live Lesson
    | "group_work" // 🤝 Group Work
    | "certificate"; // 🏆 Certificate Lesson

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    type: LessonType;
    order: number;
    isFree: boolean;
    duration: number; // in seconds

    // Video type
    videoUrl?: string;
    videoThumbnail?: string;
    subtitlesUrl?: string;

    // Text type
    content?: string; // Markdown content

    // Quiz/Exam type
    passingScore?: number;
    timeLimit?: number;
    shuffleOptions?: boolean;
    showAnswers?: boolean;
    questions?: QuizQuestion[];

    // Assignment type
    instructions?: string;
    allowFileUpload?: boolean;
    allowTextSubmission?: boolean;
    allowedFileTypes?: string;
    maxFileSize?: number;
    dueDate?: Date;
    requiresManualReview?: boolean;

    // Coding type
    starterCode?: string;
    solutionCode?: string;
    language?: string;
    testCases?: string; // JSON
    allowedLanguages?: string;

    // External/Live type
    externalUrl?: string;
    externalType?: string;
    scheduledAt?: Date;
    recordingUrl?: string;

    // Milestone type
    requiredLessons?: string; // JSON array of lesson IDs

    // Discussion type
    allowComments?: boolean;

    // Relations
    resources?: LessonResource[];
}

// Quiz related types
export type QuestionType =
    | "multiple_choice"
    | "multi_select"
    | "true_false"
    | "fill_blank"
    | "matching"
    | "short_answer"
    | "code";

export interface QuizQuestion {
    id: string;
    lessonId: string;
    type: QuestionType;
    question: string;
    explanation?: string | null;
    points: number;
    order: number;
    options?: QuizOption[];
}

export interface QuizOption {
    id: string;
    questionId: string;
    text: string;
    isCorrect: boolean;
    order: number;
    matchesTo?: string | null; // For matching questions
}

export interface QuizAnswer {
    id: string;
    questionId: string;
    userId: string;
    answer: string; // JSON for complex answers
    isCorrect: boolean;
    points: number;
}

// Submission types
export type SubmissionStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "graded"
    | "returned";

export interface LessonSubmission {
    id: string;
    lessonId: string;
    userId: string;
    status: SubmissionStatus;
    textContent?: string;
    codeContent?: string;
    fileUrls?: string; // JSON array
    codeOutput?: string;
    testResults?: string; // JSON
    passedTests?: number;
    totalTests?: number;
    score?: number;
    feedback?: string;
    gradedBy?: string;
    gradedAt?: Date;
    submittedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Lesson Comment (Discussion)
export interface LessonComment {
    id: string;
    lessonId: string;
    userId: string;
    user?: Pick<User, "id" | "name" | "image">;
    content: string;
    parentId?: string;
    replies?: LessonComment[];
    isPinned: boolean;
    isInstructor: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Lesson Progress with type-specific data
export interface LessonProgress {
    id: string;
    userId: string;
    lessonId: string;
    watchedSeconds: number;
    quizScore?: number | null;
    quizAttempts: number;
    lastQuizDate?: Date | null;
    codePassed?: boolean | null;
    codeScore?: number | null;
    isCompleted: boolean;
    completedAt?: Date | null;
}

export interface LessonResource {
    id: string;
    title: string;
    type: "pdf" | "code" | "slides" | "cheatsheet" | "source_code" | "link" | "file";
    url: string;
}

// Category
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    coursesCount: number;
}

// Enrollment
export interface CourseEnrollment {
    id: string;
    userId: string;
    courseId: string;
    course: Course;
    progress: number; // percentage
    completedLessons: string[];
    enrolledAt: Date;
    completedAt?: Date;
}

// Reviews
export interface Review {
    id: string;
    userId: string;
    user: Pick<User, "id" | "name" | "image">;
    courseId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

// Orders & Payments
export interface Order {
    id: string;
    userId: string;
    courseId: string;
    course: Pick<Course, "id" | "title" | "thumbnail" | "price">;
    amount: number;
    status: OrderStatus;
    paymentMethod: string;
    createdAt: Date;
}

export type OrderStatus = "pending" | "completed" | "failed" | "refunded";

// Dashboard Stats
export interface DashboardStats {
    totalRevenue: number;
    totalStudents: number;
    totalCourses: number;
    totalOrders: number;
    recentOrders: Order[];
    recentEnrollments: CourseEnrollment[];
    popularCourses: Course[];
}

export interface CustomerDashboardStats {
    enrolledCourses: number;
    completedCourses: number;
    certificatesEarned: number;
    totalWatchTime: number; // in minutes
    recentActivity: ActivityItem[];
    continueLearning: CourseEnrollment[];
}

export interface ActivityItem {
    id: string;
    type:
        | "lesson_completed"
        | "course_enrolled"
        | "certificate_earned"
        | "review_posted";
    title: string;
    description: string;
    timestamp: Date;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Video streaming
export interface VideoToken {
    token: string;
    expiresAt: number;
    lessonId: string;
}

// Navigation
export interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string;
    disabled?: boolean;
    external?: boolean;
    items?: NavItem[];
}

export interface SidebarNavItem extends NavItem {
    roles?: UserRole[]; // For RBAC
}
