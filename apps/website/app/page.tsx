import Link from "next/link";
import { FaqSection } from "@/component/FaqSection"
import { howToUseData } from '../data/featuresData'
import SectionTitle from "@/component/SectionTitle"
import Navbar from "@/component/Navbar"
import Footer from "@/component/Footer"

export default function Page() {

  return (
    <div className="flex min-h-screen flex-col items-center text-center">
      <Navbar />

      {/* Hero section — gradient bg scoped here so it doesn't repaint the whole page on scroll */}
      <section className="relative w-full flex flex-col items-center px-4 pb-40 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover bg-top">
        <CommunityBadge />
        <HeroText />
        <CTAButton />

        {/* Soft fade so the hero gradient blends into the page background instead of a hard cut */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-white dark:to-gray-950"
        />
      </section>

      <Section />
      <FaqSection />
      <Footer />
    </div>
  );
}

// Move sections into small components to keep Page server-only

function CommunityBadge() {
  const avatars = [
    { initials: "🧑‍🚀", className: "bg-purple-500 text-white" },
    { initials: "MJ", className: "bg-pink-500 text-white" },
    { initials: "👨‍🎨", className: "bg-indigo-500 text-white" },
  ];

  return (
    <div id="home" className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-44 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-600/20">
      <div className="flex items-center -space-x-3">
        {avatars.map((a) => (
          <div
            key={a.initials}
            aria-hidden="true"
            className={`size-7 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-slate-900 ${a.className}`}
          >
            {a.initials}
          </div>
        ))}
      </div>
      <p className="text-xs">Catch bugs before your users do</p>
    </div>
  );
}

function HeroText() {
  return (
    <>
      <h1 className="mt-2 text-5xl/15 md:text-[64px]/19 font-semibold max-w-3xl">
        Launch better products with{" "}
        <span className="bg-linear-to-r from-[#923FEF] dark:from-[#C99DFF] to-[#C35DE8] dark:to-[#E1C9FF] bg-clip-text text-transparent">
          real testers
        </span>
      </h1>
      <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl">
        Drop your web app&apos;s URL. Real humans test it, report bugs with screenshots, and you get notified instantly.
      </p>
    </>
  );
}

function CTAButton() {
  return (
    <div className="flex items-center gap-4 mt-8">
      <Link href="https://app.crowdtest.dev" target="_blank" rel="noopener noreferrer">
        <button className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-6 h-11">
          Try the App
        </button>
      </Link>
    </div>
  );
}

function Section() {
  return <section id="how-to-use" className="w-full py-20">
    <SectionTitle
      title="How to Use CrowdTest"
      subtitle="Share your link, let testers explore, and receive clear bug reports"
    />
    <div className="flex flex-wrap items-stretch justify-center gap-6 md:gap-4 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
      {howToUseData.map((feature, index) => (
        <div key={index} className="relative p-6 pt-8 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 md:max-w-66 text-left">
          <span
            aria-hidden="true"
            className="absolute -top-3 left-6 inline-flex items-center justify-center size-7 rounded-full bg-purple-600 text-white text-xs font-semibold shadow-sm"
          >
            {String(feature.step).padStart(2, "0")}
          </span>
          <feature.icon className="text-purple-500 size-8" strokeWidth={1.3} />
          <h3 className="text-base font-semibold">{feature.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
}
