import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

import {
  blogCategories,
  defaultBlogAuthor,
  defaultBlogCta,
  type BlogCategory,
  type BlogPostSummary,
} from "../../content/blog/schema";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const BLOG_FILE_EXTENSION = ".mdx";

type BlogPost = BlogPostSummary & {
  content: React.ReactNode;
};

const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-12 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900 dark:text-white" {...props} />
  ),
  p: (props) => (
    <p className="mt-5 text-base leading-8 text-slate-700 dark:text-slate-300" {...props} />
  ),
  ul: (props) => <ul className="mt-5 list-disc space-y-3 pl-6 text-slate-700 dark:text-slate-300" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-3 pl-6 text-slate-700 dark:text-slate-300" {...props} />,
  li: (props) => <li className="pl-1 leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 rounded-2xl border-l-4 border-purple-500 bg-purple-50 px-5 py-4 text-slate-700 dark:border-purple-400 dark:bg-slate-900 dark:text-slate-200"
      {...props}
    />
  ),
  a: ({ href = "", ...props }) => {
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-purple-600 underline decoration-purple-300 underline-offset-4 hover:text-purple-700 dark:text-purple-400 dark:decoration-purple-700 dark:hover:text-purple-300"
          {...props}
        />
      );
    }

    return (
      <Link
        href={href}
        className="font-medium text-purple-600 underline decoration-purple-300 underline-offset-4 hover:text-purple-700 dark:text-purple-400 dark:decoration-purple-700 dark:hover:text-purple-300"
        {...props}
      />
    );
  },
  code: (props) => (
    <code
      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.95em] text-slate-800 dark:bg-slate-800 dark:text-slate-100"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 px-5 py-4 text-sm text-slate-100"
      {...props}
    />
  ),
  hr: (props) => <hr className="mt-10 border-slate-200 dark:border-slate-800" {...props} />,
};

function isBlogCategory(value: unknown): value is BlogCategory {
  return typeof value === "string" && blogCategories.includes(value as BlogCategory);
}

function normalizeCategory(value: unknown): BlogCategory {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (isBlogCategory(normalized)) {
    return normalized;
  }

  return "guides";
}

function getHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^##\s+/, "").trim());
}

function toBlogSummary(data: Record<string, unknown>, content: string, slugFromFile: string): BlogPostSummary {
  const slug = typeof data.slug === "string" && data.slug.length > 0 ? data.slug : slugFromFile;
  const category = normalizeCategory(data.category);

  const keywords = Array.isArray(data.keywords)
    ? data.keywords.filter((keyword): keyword is string => typeof keyword === "string")
    : [];

  return {
    title: typeof data.title === "string" ? data.title : slug,
    slug,
    description: typeof data.description === "string" ? data.description : "",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    date: typeof data.date === "string" ? data.date : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    author: typeof data.author === "string" ? data.author : defaultBlogAuthor,
    category,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    readingTime: typeof data.readingTime === "string" ? data.readingTime : "5 min read",
    keywords,
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    ctaLabel: typeof data.ctaLabel === "string" ? data.ctaLabel : defaultBlogCta.ctaLabel,
    ctaHref: typeof data.ctaHref === "string" ? data.ctaHref : defaultBlogCta.ctaHref,
    headings: getHeadings(content),
  };
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function getAllBlogPosts() {
  const entries = await fs.readdir(BLOG_CONTENT_DIR, { withFileTypes: true });

  const posts = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(BLOG_FILE_EXTENSION))
      .map(async (entry) => {
        const fullPath = path.join(BLOG_CONTENT_DIR, entry.name);
        const source = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(source);

        return toBlogSummary(data, content, entry.name.replace(/\.mdx$/, ""));
      })
  );

  return posts
    .filter((post) => !post.draft)
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(BLOG_CONTENT_DIR, `${slug}${BLOG_FILE_EXTENSION}`);

  let source: string;

  try {
    source = await fs.readFile(fullPath, "utf8");
  } catch {
    notFound();
  }

  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: mdxComponents,
  });

  const { content: rawContent } = matter(source);
  const summary = toBlogSummary(frontmatter, rawContent, slug);

  if (summary.draft) {
    notFound();
  }

  return {
    ...summary,
    content,
  };
}

export async function getRelatedBlogPosts(category: BlogCategory, currentSlug: string, limit = 2) {
  const posts = await getAllBlogPosts();

  return posts
    .filter((post) => post.category === category && post.slug !== currentSlug)
    .slice(0, limit);
}