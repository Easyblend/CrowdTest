// app/lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface JwtPayload {
  id: number;
  email: string;
}

export async function getUserFromCookies(): Promise<JwtPayload | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
