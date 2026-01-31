import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CrowdTest | Professional Web App QA Testing for Indie Developers",
  description: "Get real human feedback on your web app before launch. Professional QA testing, bug reports, and UX feedback from actual testers.",
  keywords: ["app testing", "QA testing", "beta testing", "bug testing", "web app testing", "indie dev testing", "software testing"],
  openGraph: {
    title: "CrowdTest | Professional Web App QA Testing",
    description: "Get professional QA testing feedback before launch. Real testers, real feedback.",
    url: "https://crowdtest.dev",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CrowdTest - Human App Testing Platform",
      },
    ],
  },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
      
      {/* Hero */}
      <h1 className="max-w-3xl text-3xl md:text-5xl font-semibold tracking-tight">
        Ready to get feedback?
      </h1>

      <p className="mt-4 max-w-xl text-base md:text-lg text-muted-foreground">
        Share your app with real testers and get clear, actionable feedback
        before you ship.
      </p>

      {/* CTA */}
      <div className="mt-8">
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          Drop a link to your App →
        </Link>
      </div>
      {/* Reassurance */}
      <p className="mt-4 text-xs text-muted-foreground">
        Takes less than a minute. No commitment.
      </p>
    </div>
  );
}


