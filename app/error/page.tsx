'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const params = useSearchParams();
  const reason = params.get('reason');

  let message = 'Something went wrong.';

  if (reason === 'invalid_token') {
    message = 'The confirmation link is invalid or has already been used.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/80 dark:bg-slate-800/60 p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-3">Oops! 😕</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>

        <a
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white rounded-md py-3 px-6 font-medium"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
