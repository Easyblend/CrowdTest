import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Your Project for Testing | CrowdTest',
  description: 'Get professional QA testing for your web application. Submit your project and receive detailed bug reports and feedback from real testers.',
  keywords: ['project submission', 'app testing', 'QA testing', 'bug testing', 'web app feedback'],
  openGraph: {
    title: 'Submit Your Project for Testing | CrowdTest',
    description: 'Get professional QA testing feedback before launch.',
    url: 'https://crowdtest.dev/waitlist',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CrowdTest - Submit Your App for Testing',
      },
    ],
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
