import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear token cookie
  res.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0, // immediately expires
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}
