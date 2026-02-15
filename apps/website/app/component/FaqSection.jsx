"use client";
import SectionTitle from "../component/SectionTitle";
import { useThemeContext } from "../../context/ThemeContext";
import { faqsData } from "../../data/faqsData";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const FaqSection = () => {
    const { theme } = useThemeContext();
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div id="faq" className="relative max-w-2xl mx-auto flex flex-col items-center justify-center px-4 md:px-0">
            <Image className="absolute -mb-120 -left-40 -z-10 pointer-events-none" src={theme === "dark" ? "/assets/color-splash.svg" : "/assets/color-splash-light.svg"} alt="color-splash" width={1000} height={1000} priority fetchPriority="high" />
            <SectionTitle
                title="Frequently asked questions"
                subtitle="Learn how CrowdTest works and get answers about sharing your project, tester feedback, and bug reports"
            />
            <div className="mt-8">
                {faqsData.map((faq, index) => (
                    <div className="border-b border-slate-300 dark:border-purple-900 py-4 cursor-pointer w-full" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">
                                {faq.question}
                            </h3>
                            <ChevronDown size={18} className={`${openIndex === index && "rotate-180"} transition-all duration-500 ease-in-out`} />
                        </div>
                        <div
                            className={`grid transition-all duration-500 ease-in-out ${openIndex === index
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }`}
                        >
                            <div className="overflow-hidden">
                                <p className="text-sm text-slate-600 dark:text-slate-300 pt-4">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};