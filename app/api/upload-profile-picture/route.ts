import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

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

    const uniqueFileName = `${Date.now()}-${filename}`;

    const blob = await put(
      `${userid}/profile-pictures/${uniqueFileName}`,
      request.body,
      {
        access: 'public',
        allowOverwrite: true,
      }
    );

    return NextResponse.json(blob, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error uploading picture:', error);
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
