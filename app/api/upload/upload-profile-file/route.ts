import { auth } from '@/auth';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

import {
  MAX_PROFILE_FILE_SIZE_BYTES,
  MAX_PROFILE_FILE_SIZE_MB,
} from '@/utils/constants';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const userid = searchParams.get('userid');

    if (!userid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (userid !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
    if (
      contentLength &&
      parseInt(contentLength) > MAX_PROFILE_FILE_SIZE_BYTES
    ) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_PROFILE_FILE_SIZE_MB}MB limit` },
        { status: 413 }
      );
    }

    const blob = await put(
      `${userid}/profile-files/${filename}`,
      request.body,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    );

    return NextResponse.json(blob, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error uploading profile file:', error);
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
