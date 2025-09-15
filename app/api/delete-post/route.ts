import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json('ID of the post is required', {
        status: 400,
      });
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
