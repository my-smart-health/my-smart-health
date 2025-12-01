import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          message: 'Nur Administratoren können Benachrichtigungen archivieren',
        },
        { status: 403 }
      );
    }

    const { notificationId, unarchive } = (await request.json()) as {
      notificationId: string;
      unarchive?: boolean;
    };

    if (!notificationId) {
      return NextResponse.json(
        { message: 'Notification ID ist erforderlich' },
        { status: 400 }
      );
    }

    await prisma.adminNotification.update({
      where: { id: notificationId },
      data: { archivedAt: unarchive ? null : new Date() },
    });

    return NextResponse.json(
      { message: 'Benachrichtigung erfolgreich archiviert' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error archiving notification:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist beim Archivieren aufgetreten' },
      { status: 500 }
    );
  }
}
