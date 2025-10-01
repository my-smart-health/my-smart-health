import prisma from '@/lib/db';
import { del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json('ID of the user is required', {
        status: 400,
      });
    }

    const blobs = await list({ prefix: `${id}/` });

    for (const blob of blobs.blobs) {
      await del(blob.url);
    }

    await del(`${id}/`);

    await prisma.posts.deleteMany({
      where: { authorId: id },
    });

    await prisma.certificate.deleteMany({
      where: { userId: id },
    });

    const deletedUser = await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error removing user:', error);
    }
    return NextResponse.json('Failed to remove user', { status: 500 });
  }
}
