import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

  const user = await prisma.waitlist.findFirst({ where: { confirmationToken: token } });
  if (!user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL_STG}/error?reason=invalid_token`
    );    
  }

  await prisma.waitlist.update({
    where: { id: user.id },
    data: { confirmed: true, confirmationToken: null },
  });


  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL_STG}/waitlist/thank-you?verified=true`
  );

}
