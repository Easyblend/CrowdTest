"use client";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          You're officially in! 🎉
        </h2>

        <p className="text-gray-700 mb-4 text-lg">
          Your email has been successfully confirmed.
        </p>

        <p className="text-gray-500 text-sm">
          You’ll be among the first to get updates when CrowdTest launches.
        </p>

        <a
          href="/"
          className="inline-block mt-8 bg-blue-500 hover:bg-blue-600 transition text-white font-semibold rounded-md px-6 py-3"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
