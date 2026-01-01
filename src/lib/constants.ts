// ============================================
// MohirLab Constants
// ============================================

import type { NavItem, SidebarNavItem, UserRole } from "@/types";
import {
    Award,
    BarChart3,
    Bell,
    BookOpen,
    CreditCard,
    FolderOpen,
    GraduationCap,
    LayoutDashboard,
    MessageSquare,
    PlayCircle,
    Settings,
    Shield,
    Users,
} from "lucide-react";

// App Information
export const APP_NAME = "MohirLab";
export const APP_DESCRIPTION =
    "Master new skills with our premium courses. Learn from industry experts and advance your career.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

// Navigation
export const mainNavItems: NavItem[] = [
    {
        title: "Courses",
        href: "/courses",
    },
    {
        title: "Categories",
        href: "/categories",
    },
    {
        title: "Pricing",
        href: "/pricing",
    },
    {
        title: "About",
        href: "/about",
    },
];

// Dashboard Sidebar Navigation based on roles
export const dashboardNavItems: SidebarNavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["owner", "manager", "customer"],
    },
    {
        title: "My Courses",
        href: "/dashboard/my-courses",
        icon: PlayCircle,
        roles: ["customer"],
    },
    {
        title: "Certificates",
        href: "/dashboard/certificates",
        icon: Award,
        roles: ["customer"],
    },
    // Manager & Owner routes
    {
        title: "Courses",
        href: "/dashboard/courses",
        icon: BookOpen,
        roles: ["owner", "manager"],
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: FolderOpen,
        roles: ["owner", "manager"],
    },
    {
        title: "Students",
        href: "/dashboard/students",
        icon: GraduationCap,
        roles: ["owner", "manager"],
    },
    {
        title: "Reviews",
        href: "/dashboard/reviews",
        icon: MessageSquare,
        roles: ["owner", "manager"],
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        roles: ["owner", "manager"],
    },
    {
        title: "Orders",
        href: "/dashboard/orders",
        icon: CreditCard,
        roles: ["owner", "manager"],
    },
    // Owner only routes
    {
        title: "Team",
        href: "/dashboard/team",
        icon: Users,
        roles: ["owner"],
    },
    {
        title: "Permissions",
        href: "/dashboard/permissions",
        icon: Shield,
        roles: ["owner"],
    },
    // Settings for all
    {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        roles: ["owner", "manager", "customer"],
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["owner", "manager", "customer"],
    },
];

// Role permissions
export const rolePermissions: Record<UserRole, string[]> = {
    owner: [
        "view:dashboard",
        "manage:courses",
        "manage:categories",
        "manage:students",
        "manage:reviews",
        "view:analytics",
        "manage:orders",
        "manage:team",
        "manage:permissions",
        "manage:settings",
    ],
    manager: [
        "view:dashboard",
        "manage:courses",
        "manage:categories",
        "view:students",
        "manage:reviews",
        "view:analytics",
        "view:orders",
        "manage:settings",
    ],
    customer: [
        "view:dashboard",
        "view:my-courses",
        "view:certificates",
        "post:reviews",
        "manage:settings",
    ],
};

// Course levels
export const courseLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "all-levels", label: "All Levels" },
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

// Video settings
export const VIDEO_TOKEN_EXPIRY = 3600; // 1 hour in seconds
export const MAX_VIDEO_QUALITY = "1080p";

// Footer Links
export const footerLinks = {
    product: [
        { title: "Courses", href: "/courses" },
        { title: "Categories", href: "/categories" },
        { title: "Pricing", href: "/pricing" },
        { title: "FAQ", href: "/faq" },
    ],
    company: [
        { title: "About", href: "/about" },
        { title: "Blog", href: "/blog" },
        { title: "Careers", href: "/careers" },
        { title: "Contact", href: "/contact" },
    ],
    legal: [
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
        { title: "Cookie Policy", href: "/cookies" },
        { title: "Refund Policy", href: "/refund" },
    ],
    social: [
        { title: "Twitter", href: "https://twitter.com/mohirlab" },
        { title: "LinkedIn", href: "https://linkedin.com/company/mohirlab" },
        { title: "YouTube", href: "https://youtube.com/@mohirlab" },
        { title: "Telegram", href: "https://t.me/mohirlab" },
    ],
};

// Testimonials (can be moved to DB later)
export const testimonials = [
    {
        id: "1",
        name: "Aziz Karimov",
        role: "Frontend Developer",
        company: "Tech Corp",
        image: "/testimonials/user1.jpg",
        content:
            "MohirLab's courses transformed my career. The practical approach and real-world projects helped me land my dream job.",
        rating: 5,
    },
    {
        id: "2",
        name: "Malika Usmanova",
        role: "Full Stack Developer",
        company: "Startup Inc",
        image: "/testimonials/user2.jpg",
        content:
            "The quality of instruction is outstanding. I went from beginner to professional in just 6 months.",
        rating: 5,
    },
    {
        id: "3",
        name: "Sardor Tursunov",
        role: "Data Scientist",
        company: "Analytics Pro",
        image: "/testimonials/user3.jpg",
        content:
            "Best investment in my education. The structured curriculum and expert instructors made complex topics easy to understand.",
        rating: 5,
    },
];

// Features for landing page
export const features = [
    {
        title: "Expert Instructors",
        description:
            "Learn from industry professionals with years of real-world experience.",
        icon: "GraduationCap",
    },
    {
        title: "Lifetime Access",
        description:
            "Once enrolled, access your courses forever with all future updates included.",
        icon: "Infinity",
    },
    {
        title: "Practical Projects",
        description:
            "Build real-world projects to strengthen your portfolio and skills.",
        icon: "Code",
    },
    {
        title: "Certificate of Completion",
        description:
            "Earn certificates to showcase your achievements to employers.",
        icon: "Award",
    },
    {
        title: "Community Support",
        description:
            "Join our community of learners and get help when you need it.",
        icon: "Users",
    },
    {
        title: "Mobile Friendly",
        description: "Learn on the go with our mobile-optimized video player.",
        icon: "Smartphone",
    },
];
