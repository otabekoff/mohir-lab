// ============================================
// Blog Page - MDX Powered
// ============================================

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

// Import metadata from all blog posts
import { metadata as post1 } from "@/content/blog/getting-started-nextjs-16.mdx";
import { metadata as post2 } from "@/content/blog/future-ai-education.mdx";
import { metadata as post3 } from "@/content/blog/tips-learning-code.mdx";

// Combine all posts with their slugs
const posts = [
  { ...post1, slug: "getting-started-nextjs-16" },
  { ...post2, slug: "future-ai-education" },
  { ...post3, slug: "tips-learning-code" },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full overflow-hidden p-0 transition-all hover:shadow-lg">
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
              <CardContent className="flex-1 p-6">
                <CardTitle className="line-clamp-2 hover:text-primary">
                  {post.title}
                </CardTitle>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.date)}</span>
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
    </div>
  );
}
