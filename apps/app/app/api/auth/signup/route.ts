import { prisma } from '../../..//lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const { name, email, password, confirmPassword, acceptTerms } = await req.json()

  if (!acceptTerms) return new Response(JSON.stringify({ error: "Terms not accepted" }), { status: 400 })
  if (password !== confirmPassword) return new Response(JSON.stringify({ error: "Passwords do not match" }), { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })
    return new Response(JSON.stringify({ message: "User created", userId: user.id }), { status: 201 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
