import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

async function collectSubtreeIds(id: string, acc: string[] = []) {
  acc.push(id);
  const children = await prisma.category.findMany({
    where: { parentId: id },
    select: { id: true },
  });
  for (const c of children) await collectSubtreeIds(c.id, acc);
  return acc;
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id)
      return NextResponse.json({ error: 'id required' }, { status: 400 });

    const ids = await collectSubtreeIds(id);

    await prisma.categoryUser.deleteMany({
      where: { categoryId: { in: ids } },
    });
    await prisma.category.deleteMany({ where: { id: { in: ids } } });

    return NextResponse.json({ deleted: ids.length }, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
