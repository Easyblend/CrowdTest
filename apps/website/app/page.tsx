'use client'

import Image from "next/image";
import Link from "next/link";
import { FaqSection } from "@/component/FaqSection"
import Marquee from "react-fast-marquee";
import { marqueeData } from '../data/marqueeData'
import { howToUseData } from '../data/featuresData'
import { useThemeContext } from "../context/ThemeContext";
import SectionTitle from "@/component/SectionTitle"
import Navbar from "@/component/Navbar"
import React, { useEffect } from "react";

export default function Page() {

  useEffect(() => {
    const onScroll = () => {
      if (window.location.hash) {
        // Remove the hash from URL without reloading
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };

    // You might want a small debounce to avoid too many calls
    let timeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(onScroll, 100); // 100ms debounce
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
      {/* Client Components */}
      <Navbar />
      <CommunityBadge />
      <HeroText />
      <CTAButton />
      <SubHeader />
      <CompaniesMarquee />
      <Section />
      <FaqSection />
    </div>
  );
}

// Move sections into small components to keep Page server-only

function CommunityBadge() {
  return (
    <div id="home" className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-46 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-600/20">
      <div className="flex items-center -space-x-3">
        <Image
          className="size-7 rounded-full"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50&auto=format"
          height={50}
          width={50}
          alt="User 1"
        />
        <Image
          className="size-7 rounded-full"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50&auto=format"
          height={50}
          width={50}
          alt="User 2"
        />
        <Image
          className="size-7 rounded-full"
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
          height={50}
          width={50}
          alt="User 3"
        />
      </div>
      <p className="text-xs">Catch bugs before your users do</p>
    </div>
  );
}

function HeroText() {
  return (
    <h1 className="mt-2 text-5xl/15 md:text-[64px]/19 font-semibold max-w-3xl">
      Launch better products with{" "}
      <span className="bg-linear-to-r from-[#923FEF] dark:from-[#C99DFF] to-[#C35DE8] dark:to-[#E1C9FF] bg-clip-text text-transparent">
        real testers
      </span>
    </h1>
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

function SubHeader() {
  return (
    <h3 className="text-base text-center text-slate-400 mt-28 pb-14 font-bold">
      Backed by a community of passionate testers & founders
    </h3>
  );
}

function CompaniesMarquee() {
  const { theme } = useThemeContext();
  return (
    <Marquee className="max-w-5xl mx-auto" speed={35}>
      <div className="flex items-center justify-between gap-15">
        {marqueeData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-evenly gap-2 bg-gray-1000 px-3 py-1 rounded-full"
          >
            <div className="shrink-0">
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </Marquee>
  );
}

function Section() {
  return <div id="how-to-use">
    <SectionTitle
      title="How to Use CrowdTest "
      subtitle="Share your link, let testers explore, and receive clear bug reports"
    />
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
      {howToUseData.map((feature, index) => (
        <div key={index} className="p-6 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 md:max-w-66">
          <feature.icon className="text-purple-500 size-8 mt-4" strokeWidth={1.3} />
          <h1 className="text-base font-medium">{feature.step}</h1>
          <h3 className="text-base font-medium">{feature.title}</h3>
          <p className="text-slate-400 line-clamp-2">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
}
