import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { name: 'asc' },
          include: {
            children: true,
            categoryUsers: {
              include: { user: true },
              orderBy: { user: { name: 'asc' } },
            },
          },
        },
        categoryUsers: {
          include: { user: true },
          orderBy: { user: { name: 'asc' } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json(
      { error: 'Failed to list categories' },
      { status: 500 }
    );
  }
}
