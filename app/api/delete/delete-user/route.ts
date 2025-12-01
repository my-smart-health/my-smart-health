import prisma from '@/lib/db';
import { auth } from '@/auth';
import { del, list, type ListBlobResult } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID of the user is required' },
        { status: 400 }
      );
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

    await prisma.categoryUser.deleteMany({
      where: { userId: id },
    });

    await prisma.posts.deleteMany({
      where: { authorId: id },
    });

    await prisma.certificate.deleteMany({
      where: { userId: id },
    });

    await prisma.location.deleteMany({
      where: { userId: id },
    });

    const deletedUser = await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: 'User deleted successfully', data: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error removing user:', error);
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to remove user',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
