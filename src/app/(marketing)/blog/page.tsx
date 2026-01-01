// ============================================
// Blog Page (Placeholder)
// ============================================

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js 16: What's New",
    excerpt:
      "Explore the latest features in Next.js 16 including improved performance, new APIs, and enhanced developer experience.",
    image: "https://picsum.photos/seed/blog1/800/450",
    author: "Otabek Ismoilov",
    date: "Dec 28, 2025",
    readTime: "5 min read",
    category: "Web Development",
    slug: "getting-started-nextjs-16",
  },
  {
    id: "2",
    title: "The Future of AI in Education",
    excerpt:
      "How artificial intelligence is transforming online learning and what it means for students and educators.",
    image: "https://picsum.photos/seed/blog2/800/450",
    author: "Aziza Karimova",
    date: "Dec 25, 2025",
    readTime: "7 min read",
    category: "AI & ML",
    slug: "future-ai-education",
  },
  {
    id: "3",
    title: "5 Tips for Learning to Code Effectively",
    excerpt:
      "Practical advice for beginners on how to make the most of your coding journey and avoid common pitfalls.",
    image: "https://picsum.photos/seed/blog3/800/450",
    author: "Sardor Rahimov",
    date: "Dec 20, 2025",
    readTime: "4 min read",
    category: "Career",
    slug: "tips-learning-code",
  },
];

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">Blog</Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Latest Articles & Insights
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Stay updated with the latest in tech, education, and career
          development
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg p-0">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <Badge className="absolute top-4 left-4">
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="line-clamp-2 hover:text-primary">
                  {post.title}
                </CardTitle>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          More articles coming soon. Subscribe to our newsletter for updates!
        </p>
      </div>
    </div>
  );
}
