import prisma from '@/lib/db';
import { genSalt, hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = (await request.json()) as {
      email: string;
      password: string;
      name?: string;
      role?: 'USER' | 'ADMIN' | 'MEMBER';
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    const isFirstUser = (await prisma.user.count()) === 0;

    if (role === 'USER') {
      const response = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          role: isFirstUser ? 'ADMIN' : role,
          bio: '',
          phones: [],
          socials: [],
          profileImages: [],
        },
      });

      if (!response) {
        return NextResponse.json(
          { error: 'User registration failed' },
          { status: 500 },
        );
      }
      return NextResponse.json(
        { message: 'User registered successfully', userId: response.id },
        { status: 201 },
      );
    } else if (role === 'MEMBER') {
      const response = await prisma.memberProfile.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          role: 'MEMBER',
        },
      });

      if (!response) {
        return NextResponse.json(
          { error: 'Member registration failed' },
          { status: 500 },
        );
      }
      return NextResponse.json(
        { message: 'Member registered successfully', userId: response.id },
        { status: 201 },
      );
    }
    return NextResponse.json(
      { error: 'Invalid role specified' },
      { status: 400 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error registering user:', error);
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
