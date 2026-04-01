import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { resolveLocale } from '@/utils/common';

const messages = {
  de: {
    adminOnly: 'Nur Administratoren koennen Benachrichtigungen archivieren',
    idRequired: 'Notification-ID ist erforderlich',
    archived: 'Benachrichtigung erfolgreich archiviert',
    unarchived: 'Benachrichtigung erfolgreich wiederhergestellt',
    genericError: 'Ein Fehler ist beim Archivieren aufgetreten',
  },
  en: {
    adminOnly: 'Only administrators can archive notifications',
    idRequired: 'Notification ID is required',
    archived: 'Notification archived successfully',
    unarchived: 'Notification restored successfully',
    genericError: 'An error occurred while archiving',
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const locale = resolveLocale(request);
    const t = messages[locale];

    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          message: t.adminOnly,
        },
        { status: 403 },
      );
    }

    const { notificationId, unarchive } = (await request.json()) as {
      notificationId: string;
      unarchive?: boolean;
    };

    if (!notificationId) {
      return NextResponse.json({ message: t.idRequired }, { status: 400 });
    }

    await prisma.adminNotification.update({
      where: { id: notificationId },
      data: { archivedAt: unarchive ? null : new Date() },
    });

    return NextResponse.json(
      { message: unarchive ? t.unarchived : t.archived },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error archiving notification:', error);
    const locale = resolveLocale(request);
    return NextResponse.json(
      { message: messages[locale].genericError },
      { status: 500 },
    );
  }
}
