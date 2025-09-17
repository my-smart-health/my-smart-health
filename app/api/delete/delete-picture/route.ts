import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json('URL of the image is required', {
        status: 400,
      });
    }

    await del(url);

    return NextResponse.json('Image removed successfully', { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error removing image:', error);
    }
    return NextResponse.json('Failed to remove image', { status: 500 });
  }
}
