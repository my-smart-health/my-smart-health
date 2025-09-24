import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
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

    const blob = await put(`/my-smart-health/files/${filename}`, fileStream, {
      access: 'public',
      addRandomSuffix: true,
    });

    if (!blob || !blob.url) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Note: blob.url provides the URL to access the file publicly, while blob.downloadUrl is a direct download link.
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
