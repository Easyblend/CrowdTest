import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import { formatBlogDate, getAllBlogPosts, getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://crowdtest.dev/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: post.ogImage ? [{ url: post.ogImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

function categoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const relatedPosts = await getRelatedBlogPosts(post.category, post.slug);

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-36 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
            Back to blog
          </Link>

          <header className="mt-6 border-b border-slate-200 pb-10 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                {categoryLabel(post.category)}
              </span>
              <span>{formatBlogDate(post.date)}</span>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{post.description}</p>
          </header>

          <article className="pb-6 pt-6">{post.content}</article>

          <section className="mt-12 rounded-3xl border border-purple-200 bg-purple-50 p-8 dark:border-purple-900 dark:bg-purple-950/20">
            <h2 className="text-2xl font-semibold tracking-tight">Ship with more confidence</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-700 dark:text-slate-300">
              {post.excerpt}
            </p>
            <div className="mt-6">
              <Link
                href={post.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                {post.ctaLabel}
              </Link>
            </div>
          </section>

          {relatedPosts.length > 0 ? (
            <section className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
              <h2 className="text-2xl font-semibold tracking-tight">Related reading</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.slug} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                    <div className="text-sm text-slate-500 dark:text-slate-400">{formatBlogDate(relatedPost.date)}</div>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{relatedPost.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}