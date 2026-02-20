import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'USER') {
    return NextResponse.json({ hasContacts: false }, { status: 200 });
  }

  try {
    const contactCount = await prisma.memberDoctor.count({
      where: {
        doctorId: session.user.id,
      },
    });

    return NextResponse.json(
      { hasContacts: contactCount > 0 },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error checking contacts:', error);
    return NextResponse.json(
      { error: 'Failed to check contacts' },
      { status: 500 },
    );
  }
}
