import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const userId = searchParams.get('userId');
    if (!categoryId || !userId)
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    await prisma.categoryUser.deleteMany({ where: { categoryId, userId } });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json(
      { error: 'Failed to remove profile' },
      { status: 500 }
    );
  }
}
