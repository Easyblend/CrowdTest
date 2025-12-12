import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CrowdTest — Human-focused app testing",
  description: "Real testers. Real feedback. Catch UI/UX issues automation tools miss.",
  openGraph: {
    title: "CrowdTest — Human Testing for Indie Devs",
    description: "Real testers help you find UI/UX problems, unclear flows, spelling mistakes, and more.",
    url: "https://crowdtest.dev",
    siteName: "CrowdTest",
    images: [
      {
        url: "/og-image.png", // Store this in /public folder
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdTest — Human Testing for Indie / solo Devs",
    description: "Real testers helping you polish your product.",
    images: ["/og-image.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeContextProvider>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}
