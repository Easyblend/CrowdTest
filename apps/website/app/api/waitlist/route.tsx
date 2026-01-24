import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  // Normalize email to lowercase for case-insensitive comparison
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already exists
  const existing = await prisma.waitlist.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    if (existing.confirmed) return NextResponse.json({ alreadyConfirmed: true }); // already confirmed
    // resend confirmation if not confirmed
  }

  const token = crypto.randomBytes(32).toString('hex');

  const user = await prisma.waitlist.upsert({
    where: { email: normalizedEmail },
    update: { confirmationToken: token },
    create: { email: normalizedEmail, confirmationToken: token },
  });

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/waitlist/confirm?token=${token}`;

  await transporter.sendMail({
    from: '"CrowdTest" <hello@crowdtest.dev>',
    to: normalizedEmail,
    subject: 'Confirm your email for CrowdTest 🚀',
    html: `
      <div style="font-family: Arial,sans-serif; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px; border:1px solid #eee;">
        <div style="text-align:center; margin-bottom:20px;">
          <img src="https://res.cloudinary.com/dbzhg2k1f/image/upload/v1765135740/mncszntiqkq0mhvrtlsw.png" alt="CrowdTest Logo" width="120" />
          <h2>Confirm your email</h2>
        </div>
        <p>Thanks for joining CrowdTest! 🎉<br>Please confirm your email to be officially on the waitlist.</p>
        <div style="text-align:center; margin-top:20px;">
          <a href="${confirmUrl}" style="background:#4f46e5;color:white;padding:12px 25px;border-radius:6px;font-weight:bold;text-decoration:none;">Confirm Email</a>
        </div>
        <p style="font-size:12px;color:#999;text-align:center;margin-top:20px;">You received this because you signed up for CrowdTest waitlist.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
