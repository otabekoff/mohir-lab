// ============================================
// Blog Post Detail Page
// ============================================

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Mock blog posts data
const posts: Record<
  string,
  {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    date: string;
    readTime: string;
    category: string;
  }
> = {
  "getting-started-nextjs-16": {
    id: "1",
    title: "Getting Started with Next.js 16: What's New",
    excerpt:
      "Explore the latest features in Next.js 16 including improved performance, new APIs, and enhanced developer experience.",
    content: `
      <h2>Introduction</h2>
      <p>Next.js 16 brings a host of exciting new features and improvements that make building modern web applications even easier. In this article, we'll explore what's new and how you can take advantage of these features in your projects.</p>
      
      <h2>Key Features</h2>
      <h3>React Compiler</h3>
      <p>One of the most significant additions is the React Compiler, which automatically optimizes your React components for better performance. No more manual memoization!</p>
      
      <h3>Improved Turbopack</h3>
      <p>Turbopack is now the default bundler, offering significantly faster development builds and hot module replacement.</p>
      
      <h3>Enhanced Server Actions</h3>
      <p>Server Actions have been refined with better error handling and improved TypeScript support.</p>
      
      <h2>Getting Started</h2>
      <p>To create a new Next.js 16 project, simply run:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      
      <h2>Conclusion</h2>
      <p>Next.js 16 represents a significant step forward for the framework. Whether you're building a simple blog or a complex enterprise application, these new features will help you build faster and more efficiently.</p>
    `,
    image: "https://picsum.photos/seed/blog1/1200/600",
    author: {
      name: "Otabek Ismoilov",
      avatar: "https://i.pravatar.cc/150?u=otabek",
      role: "Founder & CEO",
    },
    date: "Dec 28, 2025",
    readTime: "5 min read",
    category: "Web Development",
  },
  "future-ai-education": {
    id: "2",
    title: "The Future of AI in Education",
    excerpt:
      "How artificial intelligence is transforming online learning and what it means for students and educators.",
    content: `
      <h2>The AI Revolution in Learning</h2>
      <p>Artificial intelligence is reshaping how we learn and teach. From personalized learning paths to intelligent tutoring systems, AI is making education more accessible and effective than ever before.</p>
      
      <h2>Personalized Learning</h2>
      <p>AI can analyze a student's learning patterns and adapt content to their individual needs. This means faster progress for quick learners and additional support for those who need it.</p>
      
      <h2>Intelligent Tutoring</h2>
      <p>AI tutors can provide instant feedback and explanations, available 24/7. They never get tired and can adapt their teaching style to each student.</p>
      
      <h2>What This Means for MohirLab</h2>
      <p>We're actively integrating AI features into our platform to enhance your learning experience. Stay tuned for exciting updates!</p>
    `,
    image: "https://picsum.photos/seed/blog2/1200/600",
    author: {
      name: "Aziza Karimova",
      avatar: "https://i.pravatar.cc/150?u=aziza",
      role: "Head of Education",
    },
    date: "Dec 25, 2025",
    readTime: "7 min read",
    category: "AI & ML",
  },
  "tips-learning-code": {
    id: "3",
    title: "5 Tips for Learning to Code Effectively",
    excerpt:
      "Practical advice for beginners on how to make the most of your coding journey and avoid common pitfalls.",
    content: `
      <h2>1. Start with the Fundamentals</h2>
      <p>Don't rush to learn the latest framework. Master the basics first – HTML, CSS, and JavaScript. A strong foundation makes everything else easier.</p>
      
      <h2>2. Code Every Day</h2>
      <p>Consistency is key. Even 30 minutes of daily practice is better than 8-hour weekend marathons. Build the habit.</p>
      
      <h2>3. Build Projects</h2>
      <p>The best way to learn is by doing. Build projects that interest you, even if they're simple at first.</p>
      
      <h2>4. Don't Fear Errors</h2>
      <p>Errors are your friends – they teach you what went wrong. Read error messages carefully and learn from them.</p>
      
      <h2>5. Join a Community</h2>
      <p>Learning alone is hard. Join communities, ask questions, and help others. Teaching reinforces your own understanding.</p>
    `,
    image: "https://picsum.photos/seed/blog3/1200/600",
    author: {
      name: "Sardor Rahimov",
      avatar: "https://i.pravatar.cc/150?u=sardor",
      role: "Lead Instructor",
    },
    date: "Dec 20, 2025",
    readTime: "4 min read",
    category: "Career",
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="container py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{post.excerpt}</p>

          <div className="mt-6 flex items-center gap-4">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {post.author.role}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <Separator className="mb-8" />

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-8" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              More Articles
            </Link>
          </Button>
          <Button variant="ghost">
            <Share2 className="mr-2 h-4 w-4" />
            Share Article
          </Button>
        </div>
      </div>
    </article>
  );
}
