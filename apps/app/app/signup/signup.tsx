'use client'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

type FormData = {
    name: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
}

export default function SignupPage() {

    const router = useRouter()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
    const [success, setSuccess] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const password = watch('password', '')
    const confirmPassword = watch('confirmPassword', '')
    const passwordsMatch = !confirmPassword || password === confirmPassword

    async function onSubmit(data: FormData) {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match")
            setSubmitting(false)
            return
        }
        setSubmitting(true)
        setSuccess(null)

        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name, // 👈 store extra user info
                    },
                },
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Account created successfully!')
                router.push('/login')
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // signup with google
    const signupWithGoogle = async () => {
        console.log(`${window.location.origin}/api/auth/callback`)
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-no-repeat bg-cover">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 sm:p-10 transition-all duration-300 hover:shadow-3xl"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Join us today — free and easy.</p>
                </div>

                <div className="space-y-6">
                    <label className="block">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</span>
                        <input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            placeholder="Enter your full name"
                            aria-invalid={errors.name ? 'true' : 'false'}
                            className="mt-2 w-full rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
                    </label>

                    <label className="block">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</span>
                        <input
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                            })}
                            placeholder="you@example.com"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            className="mt-2 w-full rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
                    </label>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</span>
                            <input
                                id="password"
                                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                                type="password"
                                placeholder="••••••••"
                                aria-invalid={errors.password ? 'true' : 'false'}
                                className="mt-2 w-full rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
                            {!errors.password && password.length > 0 && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Length: {password.length}/64</p>
                            )}
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</span>
                            <input
                                id="confirmPassword"
                                {...register('confirmPassword', { required: 'Please confirm your password' })}
                                type="password"
                                placeholder="••••••••"
                                aria-invalid={errors.confirmPassword || !passwordsMatch ? 'true' : 'false'}
                                className={`mt-2 w-full rounded-xl bg-gray-50 dark:bg-gray-700 border px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${!passwordsMatch ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400'}`}
                            />
                            {(errors.confirmPassword || !passwordsMatch) && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{!passwordsMatch ? "Passwords don't match" : errors.confirmPassword?.message}</p>
                            )}
                        </label>
                    </div>

                    <label className="flex items-start gap-3">
                        <input
                            id="acceptTerms"
                            type="checkbox"
                            {...register('acceptTerms', { required: true })}
                            className="mt-1 h-4 w-4 rounded accent-indigo-600 dark:accent-indigo-500"
                        />
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            I agree to the <a className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300" href="/terms">terms and conditions</a>
                        </div>
                    </label>
                    {errors.acceptTerms && <p className="text-xs text-red-600 dark:text-red-400">You must accept the terms</p>}

                    <button
                        type="submit"
                        disabled={submitting || !passwordsMatch}
                        className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-3 px-4 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {submitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={signupWithGoogle}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-xl py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.22 3.6l6.9-6.9C36.68 2.44 30.77 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.06 6.26C12.5 13.06 17.78 9.5 24 9.5z"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.5 24c0-1.64-.15-3.22-.43-4.73H24v9h12.7c-.55 2.96-2.2 5.47-4.71 7.16l7.26 5.64C43.98 37.1 46.5 30.99 46.5 24z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.62 28.48a14.5 14.5 0 0 1 0-8.96l-8.06-6.26A24 24 0 0 0 0 24c0 3.84.92 7.47 2.56 10.74l8.06-6.26z"
                            />
                            <path
                                fill="#34A853"
                                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.26-5.64c-2.02 1.36-4.6 2.16-8.65 2.16-6.22 0-11.5-3.56-13.38-8.5l-8.06 6.26C6.51 42.62 14.62 48 24 48z"
                            />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
                    </button>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300">
                            Sign in
                        </Link>
                    </div>

                    {success && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-center text-green-700 dark:text-green-400">{success}</p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}