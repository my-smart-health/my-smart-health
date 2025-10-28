import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '@/utils/constants';

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const userid = searchParams.get('userid');

    if (!userid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }
    if (!request.body) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_IMAGE_SIZE_MB}MB limit` },
        { status: 413 }
      );
    }

    const blob = await put(`${userid}/news/${filename}`, request.body, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json(blob, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error uploading picture:', error);
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
