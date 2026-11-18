import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServer(req: Request | null) {
  const cookieStore = await cookies()

  const authHeader = req?.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
      global: {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      }
    }
  )
}