import { auth } from '@/auth';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '@/utils/constants';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    const file = request.body;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_IMAGE_SIZE_MB}MB limit` },
        { status: 413 }
      );
    }

    const blob = await put(`/my-smart-health/images/${filename}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    if (!blob) {
      return NextResponse.json(
        { error: 'Failed to upload picture' },
        { status: 500 }
      );
    }

    return NextResponse.json(blob, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error uploading picture:', error);
    }
    return NextResponse.json(
      {
        error: 'Server error',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
