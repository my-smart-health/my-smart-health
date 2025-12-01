import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '@/utils/constants';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    const fileStream = req.body;
    if (!fileStream) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_IMAGE_SIZE_MB}MB limit` },
        { status: 413 }
      );
    }

    const blob = await put(`/my-smart-health/files/${filename}`, fileStream, {
      access: 'public',
      allowOverwrite: true,
    });

    if (!blob || !blob.url) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'File uploaded successfully', url: blob.downloadUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: (error as Error).message },
      { status: 500 }
    );
  }
}
