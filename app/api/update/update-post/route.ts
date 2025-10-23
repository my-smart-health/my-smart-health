import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const { id, title, content, photos, tags, socialLinks } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.posts.update({
      where: { id: id },
      data: {
        title,
        content,
        photos,
        tags,
        socialLinks,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
