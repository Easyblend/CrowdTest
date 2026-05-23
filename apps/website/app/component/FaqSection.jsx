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
                {faqsData.map((faq, index) => {
                    const isOpen = openIndex === index;
                    const panelId = `faq-panel-${index}`;
                    const buttonId = `faq-button-${index}`;
                    return (
                        <div
                            key={index}
                            className="border-b border-slate-300 dark:border-purple-900 w-full"
                        >
                            <button
                                type="button"
                                id={buttonId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => toggleIndex(index)}
                                className="flex w-full items-center justify-between py-4 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm"
                            >
                                <h3 className="text-base font-medium">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    size={18}
                                    aria-hidden="true"
                                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            <div
                                id={panelId}
                                role="region"
                                aria-labelledby={buttonId}
                                hidden={!isOpen}
                            >
                                {isOpen && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 pb-4">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};