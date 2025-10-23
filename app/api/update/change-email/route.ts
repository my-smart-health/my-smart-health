import { auth } from '@/auth';
import prisma from '@/lib/db';
import { compare } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password, newEmail } = (await request.json()) as {
      password: string;
      newEmail: string;
    };

    if (!password || !newEmail) {
      return NextResponse.json(
        { error: 'Password and new email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if new email is same as current
    if (user.email === newEmail) {
      return NextResponse.json(
        { error: 'New email must be different from current email' },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Password is incorrect' },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    // Update email
    await prisma.user.update({
      where: { id: session.user.id },
      data: { email: newEmail },
    });

    return NextResponse.json(
      { message: 'Email changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error changing email:', error);
    }
    return NextResponse.json(
      { error: 'Failed to change email' },
      { status: 500 }
    );
  }
}
