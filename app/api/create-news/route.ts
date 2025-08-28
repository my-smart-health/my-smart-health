import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { authorId, title, content, photos } = await req.json();

    if (!authorId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const news = await prisma.posts.create({
      data: {
        authorId,
        title,
        content,
        photos,
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: 'User registration failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
