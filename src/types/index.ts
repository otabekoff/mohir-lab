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

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl: string; // Secure streaming URL
    duration: number; // in seconds
    order: number;
    isFree: boolean; // Preview lessons
    resources?: LessonResource[];
}

export interface LessonResource {
    id: string;
    title: string;
    type: "pdf" | "code" | "link" | "file";
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
