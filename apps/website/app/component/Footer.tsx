import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

const productLinks = [
    { name: "How to use", href: "#how-to-use" },
    { name: "FAQ", href: "#faq" },
    { name: "Try the App", href: "https://app.crowdtest.dev", external: true },
];

const legalLinks = [
    { name: "Terms", href: "https://app.crowdtest.dev/terms", external: true },
    { name: "Privacy", href: "https://app.crowdtest.dev/terms", external: true },
];

const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/bug_inspector", icon: Twitter },
    { name: "GitHub", href: "https://github.com/Easyblend/CrowdTest", icon: Github },
    { name: "Email", href: "mailto:hello@crowdtest.dev", icon: Mail },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-6xl px-6 lg:px-12 py-12 grid gap-10 md:grid-cols-3 text-left">
                {/* Brand */}
                <div>
                    <Link href="#home" className="flex items-center gap-2 hover:opacity-80 transition">
                        <Image
                            src="/assets/logo-light.png"
                            alt="CrowdTest logo"
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                        />
                        <span className="text-lg font-semibold tracking-tight">
                            Crowd<span className="text-purple-600">Test</span>
                        </span>
                    </Link>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                        Real testers. Real feedback. Catch UI/UX issues automation tools miss.
                    </p>
                </div>

                {/* Product */}
                <div>
                    <h4 className="text-sm font-semibold mb-3">Product</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {productLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal + Social */}
                <div>
                    <h4 className="text-sm font-semibold mb-3">Legal</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {legalLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <h4 className="text-sm font-semibold mt-6 mb-3">Connect</h4>
                    <div className="flex items-center gap-3">
                        {socialLinks.map(({ name, href, icon: Icon }) => (
                            <Link
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={name}
                                className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <Icon size={18} aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800">
                <div className="mx-auto max-w-6xl px-6 lg:px-12 py-6 text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>© {new Date().getFullYear()} CrowdTest. All rights reserved.</p>
                    <p>Built for indie devs & founders.</p>
                </div>
            </div>
        </footer>
    );
}
