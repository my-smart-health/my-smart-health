import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { authorId, title, content, photos, tags, socialLinks } =
      await req.json();

    if (!authorId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (authorId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const news = await prisma.posts.create({
      data: {
        authorId,
        title,
        content,
        photos,
        tags,
        socialLinks,
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating news:', error);
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
