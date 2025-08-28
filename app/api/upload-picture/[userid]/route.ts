import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(
  request: Request,
  context: { params: { userid: string } }
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const { userid } = await context.params;
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }
    if (!request.body) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const blob = await put(`${userid}/${filename}`, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
