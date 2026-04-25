import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabaseServer'
import { prisma } from '@/lib/prisma'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id }
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <>{children}</>
}