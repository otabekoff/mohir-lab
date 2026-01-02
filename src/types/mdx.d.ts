// Type declarations for MDX files with custom exports

declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const metadata: {
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

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
