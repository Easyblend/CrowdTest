// app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabaseServer';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  
       const {
      data: { user },
    } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

   
const dbUser = await prisma.user.upsert({
  where: { auth_id: user.id },
  update: {},
  create: {
    auth_id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || "Unnamed User",
    avatar_url: user.user_metadata?.avatar_url || null,
    role: "DEV",
  }
})

return NextResponse.json(dbUser)
}
