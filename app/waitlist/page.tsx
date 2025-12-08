'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WaitlistSignup() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setSubmitting(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // SUCCESS MESSAGE (after submit)
  // -----------------------------
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-cover bg-no-repeat px-4">
        <div className="bg-white/80 dark:bg-slate-800/60 p-8 rounded-xl shadow-lg backdrop-blur-sm w-full max-w-md text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            You're almost in! 🎉
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Check your inbox to confirm your subscription to the CrowdTest waitlist.
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Didn’t receive it? Check your spam folder or try again.
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // WAITLIST SIGNUP FORM
  // -----------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-cover bg-no-repeat px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 dark:bg-slate-800/60 p-8 rounded-xl shadow-lg backdrop-blur-sm w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white">
          Join the CrowdTest Waitlist
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
          Be the first to test products, earn rewards, and access early features.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 hover:bg-purple-700 transition text-white rounded-md py-3 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Join Waitlist'}
        </button>
      </form>
    </div>
  );
}
