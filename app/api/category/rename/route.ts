import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { categoryId, name } = await req.json();
    if (!categoryId || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
      select: { id: true, name: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json(
      { error: 'Failed to rename category' },
      { status: 500 }
    );
  }
}
