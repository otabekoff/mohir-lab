// ============================================
// Blog Post Detail Page - MDX Dynamic Import
// ============================================

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Define available blog posts for static generation
export function generateStaticParams() {
  return [
    { slug: "getting-started-nextjs-16" },
    { slug: "future-ai-education" },
    { slug: "tips-learning-code" },
  ];
}

// Prevent dynamic routes from 404ing in development
export const dynamicParams = false;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Dynamically import the MDX file
  let Post: React.ComponentType;
  let metadata: {
    title: string;
    excerpt: string;
    image: string;
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    date: string;
    readTime: string;
    category: string;
    tags?: string[];
  };

  try {
    const mdxModule = await import(`@/content/blog/${slug}.mdx`);
    Post = mdxModule.default;
    metadata = mdxModule.metadata;
  } catch {
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
          <Badge className="mb-4">{metadata.category}</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            {metadata.title}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            {metadata.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={metadata.author.avatar}
                alt={metadata.author.name}
              />
              <AvatarFallback>{metadata.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{metadata.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {metadata.author.role}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(metadata.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{metadata.readTime}</span>
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
            src={metadata.image}
            alt={metadata.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <Separator className="mb-8" />

        {/* MDX Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <Post />
        </div>

        {/* Tags */}
        {metadata.tags && metadata.tags.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

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
