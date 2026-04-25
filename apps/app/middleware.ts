import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  // 🔐 protect dashboard
  if (!user && (path.startsWith('/dashboard') || path.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

const authPages = ['/login', '/signup']

  // 🚫 block login for authenticated users
if (user && authPages.some(p => path.startsWith(p))) {
  return NextResponse.redirect(new URL('/dashboard', req.url))
}

  return res
}


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/login',
    '/signup',
    '/admin/:path*'
  ],
}