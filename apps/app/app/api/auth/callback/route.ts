import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  const res = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // NOW session exists → get user properly
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await prisma.user.upsert({
      where: { auth_id: user.id },
      update: {
        email: user.email!,
        name: user.user_metadata?.name || "Unnamed User",
        avatar_url: user.user_metadata?.avatar_url || null,
      },
      create: {
        auth_id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || "Unnamed User",
        avatar_url: user.user_metadata?.avatar_url || null,
        role: "DEV",
      },
    })
  }

  return res
}