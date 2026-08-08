import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, destroySession, getSession } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const subAction = action[0];

  try {
    let body: Record<string, unknown> = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      body = {};
    }

    if (subAction === 'logout') {
      await destroySession();
      return NextResponse.json({ message: 'Logged out successfully' });
    }

    if (subAction === 'login') {
      const { email, password } = body as { email?: string; password?: string };
      if (!email || !password) {
        return NextResponse.json({ error: 'ইমেইল এবং পাসওয়ার্ড আবশ্যক' }, { status: 400 });
      }

      if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json({ error: 'সঠিক ফরম্যাটের ইমেইল অ্যাড্রেস লিখুন' }, { status: 400 });
      }

      const user = await db.getUserByEmail(email);
      if (!user || !user.password) {
        return NextResponse.json({ error: 'অবৈধ ইমেইল বা পাসওয়ার্ড' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'অবৈধ ইমেইল বা পাসওয়ার্ড' }, { status: 401 });
      }

      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zipCode: user.zipCode
      };

      await createSession(sessionData);

      return NextResponse.json({
        message: 'লগইন সফল হয়েছে',
        user: sessionData
      });
    }

    if (subAction === 'signup') {
      const { name, email, password, phone, address, city, zipCode } = body as {
        name?: string;
        email?: string;
        password?: string;
        phone?: string;
        address?: string;
        city?: string;
        zipCode?: string;
      };

      if (!name || !email || !password || !phone || !address || !city || !zipCode) {
        return NextResponse.json({ error: 'ডাটাবেজের সকল তথ্য (নাম, ইমেইল, পাসওয়ার্ড, মোবাইল, ঠিকানা, শহর, পোস্টাল কোড) পূরণ করা আবশ্যক' }, { status: 400 });
      }

      if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json({ error: 'সঠিক ফরম্যাটের ইমেইল অ্যাড্রেস লিখুন' }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }, { status: 400 });
      }

      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json({ error: 'এই ইমেইল দিয়ে ইতোমধ্যেই একটি অ্যাকাউন্ট রয়েছে' }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // NOTE: Admin accounts CANNOT be created from the website interface. Forced to 'user' role.
      // Admin role must be granted manually via Neon Database SQL Console (UPDATE users SET role = 'admin' WHERE email = '...').
      const newUser = await db.createUser({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        phone,
        address,
        city,
        zipCode
      });

      return NextResponse.json({
        message: 'অ্যাকাউন্ট সফলভাবে নিবন্ধন করা হয়েছে। অনুগ্রহ করে লগইন করুন।',
        user: newUser
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'অবৈধ অথ এন্ডপয়েন্ট' }, { status: 404 });
  } catch (error) {
    console.error('Auth route error:', error);
    return NextResponse.json({ error: 'সার্ভার ত্রুটি ঘটেছে' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const subAction = action[0];

  if (subAction === 'me') {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }
    const fullUser = await db.getUserById(session.id);
    return NextResponse.json({ user: fullUser || session });
  }

  return NextResponse.json({ error: 'অবৈধ এন্ডপয়েন্ট' }, { status: 404 });
}
