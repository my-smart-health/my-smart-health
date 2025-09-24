import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
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
