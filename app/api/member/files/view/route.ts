import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import {
  extractS3KeyFromUrlOrPath,
  getS3SignedObjectUrl,
  resolveS3BucketVisibilityFromUrlOrPath,
} from '@/lib/s3-storage';

const MIN_EXPIRES_SECONDS = 60;
const MAX_EXPIRES_SECONDS = 3600;
const DEFAULT_EXPIRES_SECONDS = 300;

const parseExpiresIn = (value: string | null) => {
  if (!value) {
    return DEFAULT_EXPIRES_SECONDS;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return null;
  }

  if (parsed < MIN_EXPIRES_SECONDS || parsed > MAX_EXPIRES_SECONDS) {
    return null;
  }

  return parsed;
};

const parseDownload = (value: string | null) =>
  value === '1' || value === 'true';

const parseRedirect = (value: string | null) =>
  value === '1' || value === 'true';

const getFileNameFromS3Key = (objectKey: string) => {
  const parts = objectKey.split('/');
  const rawName = parts[parts.length - 1] || 'file';
  try {
    return decodeURIComponent(rawName);
  } catch {
    return rawName;
  }
};

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const fileUrl = searchParams.get('fileUrl');
    const expiresIn = parseExpiresIn(searchParams.get('expiresIn'));
    const shouldDownload = parseDownload(searchParams.get('download'));
    const shouldRedirect = parseRedirect(searchParams.get('redirect'));

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 },
      );
    }

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'fileUrl is required' },
        { status: 400 },
      );
    }

    if (expiresIn === null) {
      return NextResponse.json(
        {
          error: `expiresIn must be an integer between ${MIN_EXPIRES_SECONDS} and ${MAX_EXPIRES_SECONDS}`,
        },
        { status: 400 },
      );
    }

    const isOwner = session.user.id === memberId;
    const isAdmin = session.user.role === 'ADMIN';

    let isContactUser = false;
    if (!isOwner && !isAdmin) {
      const relation = await prisma.memberDoctor.findFirst({
        where: {
          memberId,
          doctorId: session.user.id,
        },
        select: {
          id: true,
        },
      });

      isContactUser = Boolean(relation);
    }

    if (!isOwner && !isAdmin && !isContactUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const objectKey = extractS3KeyFromUrlOrPath(fileUrl);
    if (!objectKey || !objectKey.startsWith(`${memberId}/`)) {
      return NextResponse.json(
        { error: 'Invalid member file URL' },
        { status: 400 },
      );
    }

    const visibility = resolveS3BucketVisibilityFromUrlOrPath(fileUrl);
    const fileName = getFileNameFromS3Key(objectKey);
    const signedUrl = await getS3SignedObjectUrl(objectKey, {
      visibility: visibility ?? 'private',
      expiresInSeconds: expiresIn,
      responseContentDisposition: shouldDownload
        ? `attachment; filename="${fileName.replace(/"/g, '')}"`
        : undefined,
    });

    if (shouldRedirect) {
      return NextResponse.redirect(signedUrl);
    }

    return NextResponse.json(
      {
        url: signedUrl,
        expiresIn,
      },
      { status: 200 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating member file URL:', error);
    }

    return NextResponse.json(
      { error: 'Failed to generate file URL' },
      { status: 500 },
    );
  }
}
