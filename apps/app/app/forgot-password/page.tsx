'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

type FormData = {
  email: string
}

export default function ForgotPasswordPage() {
const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(data: FormData) {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset link sent! Check your email.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset your password</h1>
          <p className="text-gray-600 text-sm">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
            required: 'Email is required', 
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } 
              })}
              placeholder="Enter your email"
              className="w-full border text-gray-950 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email.message}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('error') || message.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-purple-600 hover:text-purple-800 font-medium transition">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}