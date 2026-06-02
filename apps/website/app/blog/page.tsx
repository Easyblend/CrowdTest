import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "CrowdTest Blog",
  description:
    "Practical QA guides, testing playbooks, and product insights for founders and product teams.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "CrowdTest Blog",
    description:
      "Practical QA guides, testing playbooks, and product insights for founders and product teams.",
    url: "https://crowdtest.dev/blog",
    type: "website",
  },
};

function categoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  const [featuredPost, ...remainingPosts] = posts;

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-20 pt-36 lg:px-12">
        <section className="max-w-3xl">
          <span className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300">
            CrowdTest Blog
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            QA guidance for teams shipping real products
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Practical testing guides, launch checklists, and workflow advice for founders, product teams, and early-stage SaaS companies.
          </p>
        </section>

        {featuredPost ? (
          <section className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-purple-600 px-3 py-1 font-semibold text-white">Featured</span>
              <span>{categoryLabel(featuredPost.category)}</span>
              <span>{formatBlogDate(featuredPost.date)}</span>
              <span>{featuredPost.readingTime}</span>
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              <Link href={`/blog/${featuredPost.slug}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                {featuredPost.title}
              </Link>
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
              {featuredPost.description}
            </p>
            <div className="mt-6">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 dark:bg-white dark:text-slate-950 dark:hover:bg-purple-200"
              >
                Read article
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Latest articles</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{posts.length} published</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {(remainingPosts.length > 0 ? remainingPosts : posts).map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-purple-700"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                    {categoryLabel(post.category)}
                  </span>
                  <span>{formatBlogDate(post.date)}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                <div className="mt-5">
                  <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}