'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type FormData = {
  password: string,
  confirmPassword: string
}

export default function ResetPasswordPage() {
const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(data: FormData) {
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated!')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-indigo-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Set New Password</h1>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            placeholder="Enter your new password"
            className="w-full text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: (value: string) => value === watch('password') || 'Passwords do not match'
            })}
            placeholder="Confirm your new password"
            className="w-full border text-gray-950 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}