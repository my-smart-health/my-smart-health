import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { parentId, name } = await req.json();
    if (!parentId || !name)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const parent = await prisma.category.findUnique({
      where: { id: parentId },
      select: { type: true },
    });

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent category not found' },
        { status: 404 }
      );
    }

    const sub = await prisma.category.create({
      data: {
        name,
        parent: { connect: { id: parentId } },
        type: parent.type,
      },
    });

    return NextResponse.json(sub, { status: 201 });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}
