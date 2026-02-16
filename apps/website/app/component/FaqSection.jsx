"use client";
import SectionTitle from "../component/SectionTitle";
import { faqsData } from "../../data/faqsData";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useCallback } from "react";

export const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const toggleIndex = useCallback((index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    }, []);
    return (
        <div id="faq" className="relative max-w-2xl mx-auto flex flex-col items-center justify-center px-4 md:px-0 pb-20">
            <Image className="absolute -mb-120 -left-40 -z-10 pointer-events-none dark:hidden" src="/assets/color-splash-light.svg" alt="" width={1000} height={1000} loading="lazy" />
            <Image className="absolute -mb-120 -left-40 -z-10 pointer-events-none hidden dark:block" src="/assets/color-splash.svg" alt="" width={1000} height={1000} loading="lazy" />
            <SectionTitle
                title="Frequently asked questions"
                subtitle="Learn how CrowdTest works and get answers about sharing your project, tester feedback, and bug reports"
            />
            <div className="mt-8 w-full">
                {faqsData.map((faq, index) => (
                    <div
                        key={index}
                        className="border-b border-slate-300 dark:border-purple-900 py-4 cursor-pointer w-full"
                        onClick={() => toggleIndex(index)}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">
                                {faq.question}
                            </h3>
                            <ChevronDown
                                size={18}
                                className={`shrink-0 ${openIndex === index ? "rotate-180" : ""}`}
                            />
                        </div>
                        {openIndex === index && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 pt-4">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};