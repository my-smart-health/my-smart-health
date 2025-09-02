import { NextResponse } from 'next/server';
import { genSalt, hash } from 'bcrypt';
import prisma from '@/lib/db';
import { User } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { email, password, category, phone, name, profileType } =
      (await request.json()) as User;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    const response = await prisma.user.create({
      data: {
        name: name,
        phone: phone,
        email: email,
        password: hashedPassword,
        category: category,
        profileType: profileType,
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: 'User registration failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    process.env.NODE_ENV === 'development' &&
      console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
