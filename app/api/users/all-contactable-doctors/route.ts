import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        isContactable: true,
      },
      select: {
        id: true,
        name: true,
        profileImages: true,
        fieldOfExpertise: true,
        displayEmail: true,
        phones: true,
        isContactable: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error('Error fetching all doctors:', err);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 },
    );
  }
}
