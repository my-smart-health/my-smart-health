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
