import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface JwtPayload {
  id: number;
  email: string;
  role: 'DEV' | 'ADMIN' | 'TESTER';
}
export type AuthUser = JwtPayload | null;

/* 1️⃣ For browser + Next.js environment */
export async function getUserFromCookies(): Promise<AuthUser> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

/* 2️⃣ For Postman / mobile apps / external API consumers */
export function getUserFromRequest(req: NextRequest): AuthUser {
  const cookieToken = req.cookies.get('token')?.value;
  const headerToken = req.headers.get('authorization')?.replace('Bearer ', '');

  const token = cookieToken || headerToken;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}
