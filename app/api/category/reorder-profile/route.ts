import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { categoryId, userId, order } = await req.json();
    if (!categoryId || !userId || typeof order !== 'number')
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await prisma.categoryUser.updateMany({
      where: { categoryId, userId },
      data: { order },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}
