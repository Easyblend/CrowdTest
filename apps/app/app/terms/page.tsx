'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TermsPage() {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: `By using CrowdTest, you agree to these Terms and any guidelines published on our platform. 
If you do not agree, you must not use the service.`
        },
        {
            title: "2. Account Registration",
            content: `To use certain features, you must register for an account:
- Provide accurate and up-to-date information.
- Keep your login credentials confidential.
- Notify us immediately of any unauthorized access.
We may suspend accounts that violate these Terms.`
        },
        {
            title: "3. User Content",
            content: `You retain ownership of your content, but grant CrowdTest a worldwide, royalty-free license to display and distribute it for the service. Do not submit illegal or offensive content.`
        },
        {
            title: "4. Testing and Feedback",
            content: `CrowdTest connects project owners with human testers:
- Feedback is for informational purposes only.
- Bugs, UX, and usability issues may be reported.
- Testers provide feedback "as-is."
- You may receive email notifications when a bug is reported.`
        },
        {
            title: "5. Privacy and Data Security",
            content: `Only invited testers can access your project links. Sensitive data is securely stored with industry-standard encryption. Our Privacy Policy explains data collection and usage.`
        },
        {
            title: "6. Limitation of Liability",
            content: `CrowdTest is provided "as-is." We are not liable for damages or loss of data. Continuous, error-free access is not guaranteed.`
        },
        {
            title: "7. Changes to Terms",
            content: `We may update these Terms at any time. Continued use constitutes acceptance of the updated Terms.`
        },
        {
            title: "8. Contact Us",
            content: `Questions? Contact us at: 
Email: hello@crowdtest.dev
Website: https://crowdtest.dev`
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Header */}
            <div className="bg-purple-600 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-purple-100 text-lg">Last updated: {new Date().toDateString()}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <div
                            key={idx}
                            className="group bg-white border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <ChevronRight className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-purple-600 mb-3">
                                        {section.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
                                        {section.content.includes("hello@crowdtest.dev") ? (
                                            <>
                                                {section.content.split("hello@crowdtest.dev")[0]}
                                                <Link
                                                    href="mailto:hello@crowdtest.dev"
                                                    className="text-purple-600 font-semibold hover:underline"
                                                >
                                                    hello@crowdtest.dev
                                                </Link>
                                                {section.content.split("hello@crowdtest.dev")[1]}
                                            </>
                                        ) : (
                                            section.content
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
