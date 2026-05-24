// app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabaseServer';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer(req);

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });


  const existingUser = await prisma.user.findFirst({
  where: {
    OR: [
      { auth_id: user.id },
      { email: user.email! }
    ]
  }
})

let dbUser

if (existingUser) {
  dbUser = await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      auth_id: user.id,
      email: user.email!,
      name: user.user_metadata?.name ?? existingUser.name,
      avatar_url: user.user_metadata?.avatar_url ?? existingUser.avatar_url,
    }
  })
} else {
  dbUser = await prisma.user.create({
    data: {
      auth_id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || 'Unnamed User',
      avatar_url: user.user_metadata?.avatar_url || null,
      role: 'DEV',
    }
  })
}
  
  return NextResponse.json(dbUser)
}
