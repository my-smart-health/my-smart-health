import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await params;
  const { isContactable } = await req.json();

  if (typeof isContactable !== 'boolean') {
    return NextResponse.json(
      { error: 'Invalid payload: isContactable must be a boolean' },
      { status: 400 },
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isContactable },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error('Error updating contactable status:', err);
    return NextResponse.json(
      { error: 'Failed to update contactable status' },
      { status: 500 },
    );
  }
}
