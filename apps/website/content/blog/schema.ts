export const blogCategories = [
  "guides",
  "playbooks",
  "comparisons",
  "product",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export interface BlogFrontmatter {
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  author: string;
  category: BlogCategory;
  featured?: boolean;
  draft?: boolean;
  readingTime: string;
  keywords: string[];
  ogImage?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface BlogPostSummary extends BlogFrontmatter {
  headings: string[];
}

export const defaultBlogAuthor = "CrowdTest";
export const defaultBlogCta = {
  ctaLabel: "Try CrowdTest",
  ctaHref: "https://app.crowdtest.dev",
};