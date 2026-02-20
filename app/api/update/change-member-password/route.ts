import { auth } from '@/auth';
import prisma from '@/lib/db';
import { compare, genSalt, hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'MEMBER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 },
      );
    }

    const member = await prisma.memberProfile.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, member.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 },
      );
    }

    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(newPassword, salt);

    await prisma.memberProfile.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error changing member password:', error);
    }
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 },
    );
  }
}
