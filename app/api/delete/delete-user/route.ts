import prisma from '@/lib/db';
import { del, list, type ListBlobResult } from '@vercel/blob';
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

    let cursor: string | undefined = undefined;
    do {
      const res: ListBlobResult = await list({ prefix: `${id}/`, cursor });
      for (const blob of res.blobs) {
        try {
          if (blob.pathname) await del(blob.pathname);
        } catch (err) {
          if (process.env.NODE_ENV === 'development')
            console.error('Failed to delete blob', blob.pathname, err);
        }
      }
      cursor = res.cursor;
    } while (cursor);

    await prisma.posts.deleteMany({
      where: { authorId: id },
    });

    await prisma.certificate.deleteMany({
      where: { userId: id },
    });

    await prisma.location.deleteMany({
      where: { userId: id },
    });

    await prisma.categoryUser.deleteMany({
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
