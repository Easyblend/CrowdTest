import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

  const user = await prisma.waitlist.findFirst({ where: { confirmationToken: token } });
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

  await prisma.waitlist.update({
    where: { id: user.id },
    data: { confirmed: true, confirmationToken: null },
  });

  // redirect to a thank you page or home
  return NextResponse.redirect('https://crowdtest.dev/thank-you');
}
