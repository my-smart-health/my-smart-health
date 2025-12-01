import { auth } from '@/auth';
import { del } from '@vercel/blob';
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
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json('URL of the image is required', {
        status: 400,
      });
    }

    let target = url;
    try {
      const parsed = new URL(url);
      target = parsed.pathname.startsWith('/')
        ? parsed.pathname.slice(1)
        : parsed.pathname;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid URL provided:', url, 'ERROR:', error);
      }
      return NextResponse.json('Invalid URL provided', { status: 400 });
    }

    const userId = target.split('/')[0];
    if (userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json('Forbidden', { status: 403 });
    }

    const result = await del(target);

    return NextResponse.json(
      { message: 'Image removed', url, target, result },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error removing image:', error);
    }
    return NextResponse.json('Failed to remove image', { status: 500 });
  }
}
