import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./component/ThemeToggle";

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
    <div className="flex h-screen flex-col items-center justify-center text-center px-4 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">

      {/* Community Badge */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-46 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-600/20">
        <div className="flex items-center -space-x-3">
          <Image
            className="size-7 rounded-full"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50&auto=format"
            height={50} width={50} alt="User 1"
          />
          <Image
            className="size-7 rounded-full"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50&auto=format"
            height={50} width={50} alt="User 2"
          />
          <Image
            className="size-7 rounded-full"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
            height={50} width={50} alt="User 3"
          />
        </div>

        <p className="text-xs">Join testers & founders improving products daily</p>
      </div>

      {/* Main Hero Text */}
      <h1 className="mt-2 text-5xl/15 md:text-[64px]/19 font-semibold max-w-3xl">
        Launch better products with{" "}
        <span className="bg-linear-to-r from-[#923FEF] dark:from-[#C99DFF] to-[#C35DE8] dark:to-[#E1C9FF] bg-clip-text text-transparent">
          real testers
        </span>
      </h1>

      <p className="text-base dark:text-slate-300 max-w-xl mt-3">
        CrowdTest helps you catch bugs early with real pre-launch testers.
        Join the waitlist to be part of the first beta users.
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center gap-4 mt-8">
        <Link href="/waitlist">
          <button className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-6 h-11">
            Join Waitlist
          </button>
        </Link>
      </div>

      {/* Subheader */}
      <h3 className="text-base text-center text-slate-400 mt-28 pb-14 font-medium">
        Backed by a community of passionate testers & founders
      </h3>

      <ThemeToggle />
    </div>
  );
}
