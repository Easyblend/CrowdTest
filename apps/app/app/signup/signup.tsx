'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
        if (data.password !== data.confirmPassword) return alert("Passwords don't match")

        setSubmitting(true)
        setSuccess(null)

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const json = await res.json()

            if (!res.ok) throw new Error(json.error || 'Signup failed')
            setSuccess('Account created successfully!')
            router.push('/login')
        
        } catch (err: any) {
            alert(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-lg bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-2xl p-8 sm:p-10"
            >
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-800">Create your account</h1>
                    <p className="mt-1 text-sm text-slate-500">Start building with a free account — no credit card required.</p>
                </div>

                <div className="grid gap-4">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Full name</span>
                        <input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            placeholder="John Doe"
                            aria-invalid={errors.name ? 'true' : 'false'}
                            className="mt-2 w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-slate-700 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Email</span>
                        <input
                            id="email"
                            {...register('email', {
                                required: 'Email required',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                            })}
                            placeholder="you@example.com"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            className="mt-2 w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-slate-700 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    </label>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Password</span>
                            <input
                                id="password"
                                {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 chars' } })}
                                type="password"
                                placeholder="••••••••"
                                aria-invalid={errors.password ? 'true' : 'false'}
                                className="mt-2 w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-slate-700 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                            {!errors.password && password.length > 0 && (
                                <p className="mt-1 text-xs text-slate-500">Password length: {password.length} / 64</p>
                            )}
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Confirm password</span>
                            <input
                                id="confirmPassword"
                                {...register('confirmPassword', { required: 'Confirm password required' })}
                                type="password"
                                placeholder="••••••••"
                                aria-invalid={errors.confirmPassword || !passwordsMatch ? 'true' : 'false'}
                                className={`mt-2 w-full rounded-lg bg-gray-50 border px-4 py-2 text-slate-700 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-200 ${!passwordsMatch ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500'}`}
                            />
                            {(errors.confirmPassword || !passwordsMatch) && (
                                <p className="mt-1 text-xs text-red-600">{!passwordsMatch ? "Passwords don't match" : errors.confirmPassword?.message}</p>
                            )}
                        </label>
                    </div>

                    <label className="flex items-start gap-3 mt-1">
                        <input
                            id="acceptTerms"
                            type="checkbox"
                            {...register('acceptTerms', { required: true })}
                            className="mt-1 h-4 w-4 rounded accent-indigo-600"
                        />
                        <div className="text-sm text-slate-700">
                            I accept the <a className="text-indigo-600 underline" href="/terms">terms and conditions</a>
                        </div>
                    </label>
                    {errors.acceptTerms && <p className="text-xs text-red-600">You must accept terms</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 inline-flex items-center justify-center w-full rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 text-white py-2 px-4 text-sm font-semibold shadow hover:scale-[1.01] transition disabled:opacity-60"
                    >
                        {submitting ? 'Submitting...' : 'Create account'}
                    </button>

                    <div className="mt-4 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 underline">
                            Log in
                        </Link>
                    </div>

                    {success && <p className="mt-3 text-sm text-center text-green-700">{success}</p>}
                </div>
            </form>
        </div>
    )
}