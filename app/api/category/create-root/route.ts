import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, type, position } = await req.json();
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Missing name or type' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        position: typeof position === 'number' ? position : 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
