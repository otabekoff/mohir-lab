// ============================================
// Database Seed Script for MohirLab
// ============================================

import {
    CourseLevel,
    OrderStatus,
    PrismaClient,
    ResourceType,
    UserRole,
} from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Starting database seed...\n");

    // Clean existing data
    console.log("🧹 Cleaning existing data...");
    await prisma.certificate.deleteMany();
    await prisma.order.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.section.deleteMany();
    await prisma.course.deleteMany();
    await prisma.category.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // ============================================
    // Create Users
    // ============================================
    console.log("👥 Creating users...");

    const hashedPassword = await bcrypt.hash("password123", 12);

    const owner = await prisma.user.create({
        data: {
            email: "owner@mohirlab.com",
            name: "Muhammad Ali",
            password: hashedPassword,
            role: UserRole.owner,
            emailVerified: new Date(),
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            bio: "Founder and CEO of MohirLab",
        },
    });

    const manager = await prisma.user.create({
        data: {
            email: "manager@mohirlab.com",
            name: "Sarah Johnson",
            password: hashedPassword,
            role: UserRole.manager,
            emailVerified: new Date(),
            image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            bio: "Content Manager at MohirLab",
        },
    });

    const customers = await Promise.all([
        prisma.user.create({
            data: {
                email: "john@example.com",
                name: "John Doe",
                password: hashedPassword,
                role: UserRole.customer,
                emailVerified: new Date(),
                image:
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
            },
        }),
        prisma.user.create({
            data: {
                email: "jane@example.com",
                name: "Jane Smith",
                password: hashedPassword,
                role: UserRole.customer,
                emailVerified: new Date(),
                image:
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
            },
        }),
        prisma.user.create({
            data: {
                email: "alex@example.com",
                name: "Alex Wilson",
                password: hashedPassword,
                role: UserRole.customer,
                emailVerified: new Date(),
                image:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
            },
        }),
        prisma.user.create({
            data: {
                email: "emily@example.com",
                name: "Emily Chen",
                password: hashedPassword,
                role: UserRole.customer,
                emailVerified: new Date(),
                image:
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
            },
        }),
        prisma.user.create({
            data: {
                email: "michael@example.com",
                name: "Michael Brown",
                password: hashedPassword,
                role: UserRole.customer,
                emailVerified: new Date(),
                image:
                    "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
            },
        }),
    ]);

    console.log(`  ✓ Created ${customers.length + 2} users`);

    // ============================================
    // Create Categories
    // ============================================
    console.log("📂 Creating categories...");

    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: "Web Development",
                slug: "web-development",
                description: "Learn modern web development technologies",
                icon: "Globe",
            },
        }),
        prisma.category.create({
            data: {
                name: "Mobile Development",
                slug: "mobile-development",
                description: "Build native and cross-platform mobile apps",
                icon: "Smartphone",
            },
        }),
        prisma.category.create({
            data: {
                name: "Data Science",
                slug: "data-science",
                description: "Master data analysis and machine learning",
                icon: "BarChart",
            },
        }),
        prisma.category.create({
            data: {
                name: "DevOps",
                slug: "devops",
                description: "Learn cloud infrastructure and CI/CD",
                icon: "Cloud",
            },
        }),
        prisma.category.create({
            data: {
                name: "UI/UX Design",
                slug: "ui-ux-design",
                description: "Create beautiful and user-friendly designs",
                icon: "Palette",
            },
        }),
        prisma.category.create({
            data: {
                name: "Artificial Intelligence",
                slug: "artificial-intelligence",
                description: "Explore AI and deep learning",
                icon: "Brain",
            },
        }),
    ]);

    console.log(`  ✓ Created ${categories.length} categories`);

    // ============================================
    // Create Courses
    // ============================================
    console.log("📚 Creating courses...");

    const coursesData = [
        {
            title: "Complete Next.js 16 Course",
            slug: "complete-nextjs-16-course",
            description:
                `Master Next.js 16 from scratch! This comprehensive course covers everything from the basics to advanced features including the App Router, Server Components, Server Actions, and more.

## What you'll learn:
- Next.js 16 fundamentals and project setup
- App Router and file-based routing
- Server and Client Components
- Data fetching strategies
- Server Actions and mutations
- Authentication with NextAuth.js
- Database integration with Prisma
- Deployment to Vercel

This course is perfect for developers who want to build modern, production-ready web applications.`,
            shortDescription:
                "Master Next.js 16 with App Router, Server Components, and Server Actions",
            thumbnail:
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
            price: 99.99,
            discountPrice: 79.99,
            level: CourseLevel.intermediate,
            instructor: "Muhammad Ali",
            duration: 2400,
            lessonsCount: 48,
            isFeatured: true,
            isPublished: true,
            categoryIndex: 0,
        },
        {
            title: "React 19 Masterclass",
            slug: "react-19-masterclass",
            description:
                `Become a React expert with this in-depth masterclass covering React 19's latest features including the React Compiler, use() hook, Actions, and more.

## Course Highlights:
- React 19 fundamentals
- React Compiler and automatic memoization
- New hooks: use(), useOptimistic(), useFormStatus()
- Server Components integration
- State management patterns
- Performance optimization
- Testing with React Testing Library`,
            shortDescription:
                "Learn React 19 with the new React Compiler and latest features",
            thumbnail:
                "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=450&fit=crop",
            price: 89.99,
            discountPrice: 69.99,
            level: CourseLevel.intermediate,
            instructor: "Sarah Johnson",
            duration: 1800,
            lessonsCount: 36,
            isFeatured: true,
            isPublished: true,
            categoryIndex: 0,
        },
        {
            title: "TypeScript for Professionals",
            slug: "typescript-for-professionals",
            description:
                `Take your TypeScript skills to the next level with advanced patterns, generics, and real-world application development.

## Topics Covered:
- Advanced type system features
- Generics and conditional types
- Mapped and template literal types
- Type inference and narrowing
- Module systems and namespaces
- Decorators and metadata
- Integration with popular frameworks`,
            shortDescription:
                "Advanced TypeScript patterns for professional developers",
            thumbnail:
                "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
            price: 79.99,
            discountPrice: null,
            level: CourseLevel.advanced,
            instructor: "Muhammad Ali",
            duration: 1500,
            lessonsCount: 30,
            isFeatured: true,
            isPublished: true,
            categoryIndex: 0,
        },
        {
            title: "Flutter Mobile Development",
            slug: "flutter-mobile-development",
            description:
                `Build beautiful cross-platform mobile apps with Flutter and Dart. From basics to publishing on app stores.

## What's Inside:
- Dart programming language
- Flutter widgets and layouts
- State management with Riverpod
- API integration and data persistence
- Animations and custom widgets
- Platform-specific features
- App Store and Play Store deployment`,
            shortDescription:
                "Build cross-platform mobile apps with Flutter and Dart",
            thumbnail:
                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
            price: 89.99,
            discountPrice: 74.99,
            level: CourseLevel.beginner,
            instructor: "Alex Wilson",
            duration: 2100,
            lessonsCount: 42,
            isFeatured: true,
            isPublished: true,
            categoryIndex: 1,
        },
        {
            title: "React Native Essentials",
            slug: "react-native-essentials",
            description:
                `Learn to build native mobile apps using React Native and Expo. Perfect for React developers wanting to go mobile.`,
            shortDescription: "Native mobile apps with React Native and Expo",
            thumbnail:
                "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop",
            price: 79.99,
            discountPrice: 59.99,
            level: CourseLevel.intermediate,
            instructor: "Sarah Johnson",
            duration: 1650,
            lessonsCount: 33,
            isFeatured: false,
            isPublished: true,
            categoryIndex: 1,
        },
        {
            title: "Python for Data Science",
            slug: "python-for-data-science",
            description:
                `Master Python for data analysis, visualization, and machine learning with pandas, NumPy, and scikit-learn.`,
            shortDescription: "Data analysis and ML with Python",
            thumbnail:
                "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
            price: 94.99,
            discountPrice: 79.99,
            level: CourseLevel.beginner,
            instructor: "Emily Chen",
            duration: 2250,
            lessonsCount: 45,
            isFeatured: true,
            isPublished: true,
            categoryIndex: 2,
        },
        {
            title: "Machine Learning A-Z",
            slug: "machine-learning-a-z",
            description:
                `Comprehensive machine learning course covering supervised, unsupervised learning, and deep learning basics.`,
            shortDescription:
                "Complete machine learning from basics to advanced",
            thumbnail:
                "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
            price: 119.99,
            discountPrice: 99.99,
            level: CourseLevel.intermediate,
            instructor: "Emily Chen",
            duration: 2700,
            lessonsCount: 54,
            isFeatured: true,
            isPublished: true,
            categoryIndex: 2,
        },
        {
            title: "Docker & Kubernetes Mastery",
            slug: "docker-kubernetes-mastery",
            description:
                `Learn containerization with Docker and orchestration with Kubernetes for modern cloud-native applications.`,
            shortDescription:
                "Container orchestration for production environments",
            thumbnail:
                "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop",
            price: 99.99,
            discountPrice: 84.99,
            level: CourseLevel.advanced,
            instructor: "Michael Brown",
            duration: 1950,
            lessonsCount: 39,
            isFeatured: false,
            isPublished: true,
            categoryIndex: 3,
        },
        {
            title: "AWS Cloud Practitioner",
            slug: "aws-cloud-practitioner",
            description:
                `Prepare for the AWS Cloud Practitioner certification and learn cloud computing fundamentals.`,
            shortDescription: "AWS certification preparation and cloud basics",
            thumbnail:
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
            price: 69.99,
            discountPrice: null,
            level: CourseLevel.beginner,
            instructor: "Michael Brown",
            duration: 1200,
            lessonsCount: 24,
            isFeatured: false,
            isPublished: true,
            categoryIndex: 3,
        },
        {
            title: "Figma UI/UX Design",
            slug: "figma-ui-ux-design",
            description:
                `Master Figma for professional UI/UX design. From wireframes to high-fidelity prototypes.`,
            shortDescription: "Professional UI/UX design with Figma",
            thumbnail:
                "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
            price: 74.99,
            discountPrice: 59.99,
            level: CourseLevel.beginner,
            instructor: "Jane Smith",
            duration: 1350,
            lessonsCount: 27,
            isFeatured: true,
            isPublished: true,
            categoryIndex: 4,
        },
        {
            title: "Deep Learning with TensorFlow",
            slug: "deep-learning-tensorflow",
            description:
                `Build neural networks and deep learning models using TensorFlow and Keras.`,
            shortDescription: "Neural networks and AI with TensorFlow",
            thumbnail:
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
            price: 109.99,
            discountPrice: 89.99,
            level: CourseLevel.advanced,
            instructor: "Emily Chen",
            duration: 2400,
            lessonsCount: 48,
            isFeatured: false,
            isPublished: true,
            categoryIndex: 5,
        },
        {
            title: "HTML & CSS Fundamentals",
            slug: "html-css-fundamentals",
            description:
                `Start your web development journey with HTML5 and CSS3 fundamentals.`,
            shortDescription: "Web development basics for beginners",
            thumbnail:
                "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&h=450&fit=crop",
            price: 49.99,
            discountPrice: 39.99,
            level: CourseLevel.beginner,
            instructor: "Sarah Johnson",
            duration: 900,
            lessonsCount: 18,
            isFeatured: false,
            isPublished: true,
            categoryIndex: 0,
        },
    ];

    const courses = [];
    for (const courseData of coursesData) {
        const { categoryIndex, ...data } = courseData;
        const course = await prisma.course.create({
            data: {
                ...data,
                price: data.price,
                discountPrice: data.discountPrice,
                categoryId: categories[categoryIndex].id,
                publishedAt: data.isPublished ? new Date() : null,
            },
        });
        courses.push(course);
    }

    console.log(`  ✓ Created ${courses.length} courses`);

    // ============================================
    // Create Sections and Lessons
    // ============================================
    console.log("📖 Creating sections and lessons...");

    const sampleSections = [
        {
            title: "Getting Started",
            lessons: ["Introduction", "Environment Setup", "Project Overview"],
        },
        {
            title: "Core Concepts",
            lessons: [
                "Fundamentals",
                "Key Features",
                "Best Practices",
                "Common Patterns",
            ],
        },
        {
            title: "Building Projects",
            lessons: [
                "Project Setup",
                "Implementation",
                "Testing",
                "Optimization",
            ],
        },
        {
            title: "Advanced Topics",
            lessons: [
                "Advanced Patterns",
                "Performance",
                "Security",
                "Deployment",
            ],
        },
    ];

    let totalLessons = 0;
    for (const course of courses) {
        for (let sIdx = 0; sIdx < sampleSections.length; sIdx++) {
            const sectionData = sampleSections[sIdx];
            const section = await prisma.section.create({
                data: {
                    title: sectionData.title,
                    order: sIdx + 1,
                    courseId: course.id,
                },
            });

            for (let lIdx = 0; lIdx < sectionData.lessons.length; lIdx++) {
                await prisma.lesson.create({
                    data: {
                        title: sectionData.lessons[lIdx],
                        description: `Learn about ${
                            sectionData.lessons[lIdx].toLowerCase()
                        } in this comprehensive lesson.`,
                        videoUrl:
                            `https://storage.mohirlab.com/videos/${course.slug}/s${
                                sIdx + 1
                            }-l${lIdx + 1}.mp4`,
                        duration: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
                        order: lIdx + 1,
                        isFree: sIdx === 0 && lIdx === 0, // First lesson is free
                        sectionId: section.id,
                    },
                });
                totalLessons++;
            }
        }
    }

    console.log(
        `  ✓ Created ${
            sampleSections.length * courses.length
        } sections and ${totalLessons} lessons`,
    );

    // ============================================
    // Create Enrollments
    // ============================================
    console.log("🎓 Creating enrollments...");

    const enrollments = [];
    for (const customer of customers) {
        // Each customer enrolls in 2-4 random courses
        const numCourses = Math.floor(Math.random() * 3) + 2;
        const shuffledCourses = [...courses].sort(() => Math.random() - 0.5);

        for (let i = 0; i < numCourses; i++) {
            const enrollment = await prisma.enrollment.create({
                data: {
                    userId: customer.id,
                    courseId: shuffledCourses[i].id,
                    progress: Math.floor(Math.random() * 100),
                    completedAt: Math.random() > 0.7 ? new Date() : null,
                },
            });
            enrollments.push(enrollment);
        }
    }

    console.log(`  ✓ Created ${enrollments.length} enrollments`);

    // ============================================
    // Create Reviews
    // ============================================
    console.log("⭐ Creating reviews...");

    const reviewComments = [
        "Excellent course! The instructor explains concepts very clearly.",
        "Great content and well-structured. Highly recommended!",
        "Really helped me understand the fundamentals. Worth every penny.",
        "Amazing course with practical examples. Learned so much!",
        "The best course I've taken on this subject. Very comprehensive.",
        "Good course overall, but could use more advanced examples.",
        "Perfect for beginners. The pace is just right.",
        "Fantastic instructor and great community support.",
        "Very practical and hands-on. Loved the projects!",
        "Clear explanations and excellent production quality.",
    ];

    let reviewCount = 0;
    for (const enrollment of enrollments) {
        // 70% chance of leaving a review
        if (Math.random() > 0.3) {
            await prisma.review.create({
                data: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
                    comment:
                        reviewComments[
                            Math.floor(Math.random() * reviewComments.length)
                        ],
                    isApproved: true,
                },
            });
            reviewCount++;
        }
    }

    console.log(`  ✓ Created ${reviewCount} reviews`);

    // ============================================
    // Create Orders
    // ============================================
    console.log("🛒 Creating orders...");

    let orderNumber = 1000;
    for (const enrollment of enrollments) {
        const course = courses.find((c) => c.id === enrollment.courseId);
        if (course) {
            await prisma.order.create({
                data: {
                    orderNumber: `ORD-${orderNumber++}`,
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                    amount: course.discountPrice || course.price,
                    currency: "USD",
                    status: OrderStatus.completed,
                    paymentMethod: "card",
                    paymentId: `pi_${
                        Math.random().toString(36).substring(2, 15)
                    }`,
                    completedAt: new Date(),
                },
            });
        }
    }

    console.log(`  ✓ Created ${enrollments.length} orders`);

    // ============================================
    // Update Course Statistics
    // ============================================
    console.log("📊 Updating course statistics...");

    for (const course of courses) {
        const stats = await prisma.review.aggregate({
            where: { courseId: course.id },
            _avg: { rating: true },
            _count: { id: true },
        });

        const studentCount = await prisma.enrollment.count({
            where: { courseId: course.id },
        });

        await prisma.course.update({
            where: { id: course.id },
            data: {
                rating: stats._avg.rating || 0,
                reviewsCount: stats._count.id,
                studentsCount: studentCount,
            },
        });
    }

    console.log("  ✓ Updated course statistics");

    // ============================================
    // Summary
    // ============================================
    console.log("\n✅ Database seeding completed!");
    console.log("\n📋 Summary:");
    console.log(`   • Users: ${customers.length + 2}`);
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Courses: ${courses.length}`);
    console.log(`   • Sections: ${sampleSections.length * courses.length}`);
    console.log(`   • Lessons: ${totalLessons}`);
    console.log(`   • Enrollments: ${enrollments.length}`);
    console.log(`   • Reviews: ${reviewCount}`);
    console.log(`   • Orders: ${enrollments.length}`);

    console.log("\n🔐 Test Accounts:");
    console.log("   Owner:    owner@mohirlab.com / password123");
    console.log("   Manager:  manager@mohirlab.com / password123");
    console.log("   Customer: john@example.com / password123");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
