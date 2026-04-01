import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { resolveLocale } from '@/utils/common';

const messages = {
  de: {
    adminOnly: 'Nur Administratoren koennen Benachrichtigungen loeschen',
    idRequired: 'Notification-ID ist erforderlich',
    deleted: 'Benachrichtigung erfolgreich geloescht',
    genericError: 'Ein Fehler ist beim Loeschen aufgetreten',
  },
  en: {
    adminOnly: 'Only administrators can delete notifications',
    idRequired: 'Notification ID is required',
    deleted: 'Notification deleted successfully',
    genericError: 'An error occurred while deleting',
  },
} as const;

export async function DELETE(request: NextRequest) {
  try {
    const locale = resolveLocale(request);
    const t = messages[locale];

    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: t.adminOnly }, { status: 403 });
    }

    const { notificationId } = (await request.json()) as {
      notificationId: string;
    };

    if (!notificationId) {
      return NextResponse.json({ message: t.idRequired }, { status: 400 });
    }

    await prisma.adminNotification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({ message: t.deleted }, { status: 200 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    const locale = resolveLocale(request);
    return NextResponse.json(
      { message: messages[locale].genericError },
      { status: 500 },
    );
  }
}
