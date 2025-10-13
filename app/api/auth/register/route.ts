import prisma from '@/lib/db';
import { genSalt, hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name } = (await request.json()) as {
      email: string;
      password: string;
      name?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    const isFirstUser = (await prisma.user.count()) === 0;

    const response = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: isFirstUser ? 'ADMIN' : 'USER',
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error registering user:', error);
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
