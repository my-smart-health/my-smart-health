import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { categoryId, userId, order } = await req.json();
    if (!categoryId || !userId)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await prisma.categoryUser.createMany({
      data: [{ categoryId, userId, order }],
      skipDuplicates: true,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json(
      { error: 'Failed to add profile' },
      { status: 500 }
    );
  }
}
