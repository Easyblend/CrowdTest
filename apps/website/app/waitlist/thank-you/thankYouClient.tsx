'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ThankYouPage() {
  const router = useRouter();
  const params = useSearchParams();
  const verified = params.get('verified');

  // Track whether verification is valid
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!verified) {
      router.replace('/'); // replace is smoother for redirects
      return;
    }
    setValid(true);
  }, [verified, router]);

  // While checking, show nothing (prevents flicker)
  if (valid === null) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-cover bg-no-repeat px-4">
      <div className="bg-white/80 dark:bg-slate-800/60 p-8 rounded-xl shadow-lg backdrop-blur-sm w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
          🎉 Thank You!
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Your email has been confirmed. You’re officially on the CrowdTest waitlist!
        </p>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          We’ll notify you when testing opportunities are available. Stay tuned!
        </p>

        <Link
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 transition text-white rounded-md py-3 px-6 font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
