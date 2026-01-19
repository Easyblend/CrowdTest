import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return new Response(JSON.stringify({ error: "No existing user" }), { status: 404 })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 })

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

  const response = NextResponse.json({ success: true });

response.cookies.set({
  name: 'token',
  value: token,
  httpOnly: true,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production' ? true : false, // explicitly false on dev
});



  return response;
}
