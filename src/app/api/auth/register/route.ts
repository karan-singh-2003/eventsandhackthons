// app/api/register/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      universityId,
    } = body;

    if (!email || !password || !universityId) {
      return NextResponse.json(
        { error: 'Email, Password, and University ID are required' },
        { status: 400 }
      );
    }

    // Check if user already exists by email or universityId
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { universityId }
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with email or universityId already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        universityId,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully', user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
