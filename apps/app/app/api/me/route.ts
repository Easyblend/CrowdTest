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

  let dbUser = await prisma.user.findUnique({
      where: { auth_id: user.id }
    })
  
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          auth_id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || 'Unnamed User',
        },
      })
    }
    
  return NextResponse.json(dbUser);
}
