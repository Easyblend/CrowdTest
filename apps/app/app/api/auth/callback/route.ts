import * as Sentry from "@sentry/nextjs";
import { logAudit } from '@/lib/audit'
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

  try {
    // 1. Exchange auth code
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        Sentry.captureException(error, {
          tags: { feature: "auth_callback" },
          extra: { step: "exchangeCodeForSession" }
        })
      }
    }

    // 2. Get user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError) {
      Sentry.captureException(userError, {
        tags: { feature: "auth_callback" },
        extra: { step: "getUser" }
      })
      return res
    }

    if (!user) return res

    // 3. Sync user with DB
    let dbUser

    try {
      dbUser = await prisma.user.findUnique({
        where: { auth_id: user.id },
      })

      if (!dbUser) {
        const existingByEmail = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (existingByEmail) {
          dbUser = await prisma.user.update({
            where: { email: user.email! },
            data: {
              auth_id: user.id,
              name: user.user_metadata?.name || existingByEmail.name,
              avatar_url:
                user.user_metadata?.avatar_url ||
                existingByEmail.avatar_url,
            },
          })
        } else {
          dbUser = await prisma.user.create({
            data: {
              auth_id: user.id,
              email: user.email!,
              name: user.user_metadata?.name || "Unnamed User",
              avatar_url: user.user_metadata?.avatar_url || null,
              role: "DEV",
            },
          })
        }
      }
    } catch (err) {
      Sentry.captureException(err, {
        tags: { feature: "auth_callback" },
        extra: {
          step: "prisma_user_sync",
          userId: user.id,
          email: user.email
        }
      })
      return res
    }

    // 4. Audit log (wrap separately so it never breaks auth)
    try {
      await logAudit({
        actorId: dbUser?.id,
        actorSnapshot: {
          id: dbUser?.id,
          name: dbUser?.name,
          email: dbUser?.email,
          role: dbUser?.role,
        },
        ownerId: dbUser?.id,

        action: "USER_SIGNIN",
        entityType: "user",
        entityId: dbUser?.id,

        metadata: {
          email: user.email,
          signInMethod: user.app_metadata?.provider || "unknown",
          provider: user.app_metadata?.provider,
        },

        req,
      })
    } catch (err) {
      Sentry.captureException(err, {
        tags: { feature: "audit_log" },
        extra: { step: "logAudit", userId: dbUser?.id }
      })
    }

    return res
  } catch (err) {
    Sentry.captureException(err, {
      tags: { feature: "auth_callback" },
    })

    return res
  }
}