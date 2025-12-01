import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json('Unauthorized', {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json('ID of the post is required', {
        status: 400,
      });
    }

    const post = await prisma.posts.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json('Post not found', { status: 404 });
    }

    if (post.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json('Forbidden', { status: 403 });
    }

    const deletedPost = await prisma.posts.delete({
      where: { id: id },
    });

    return NextResponse.json(deletedPost, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error removing post:', error);
    }
    return NextResponse.json('Failed to remove post', { status: 500 });
  }
}
