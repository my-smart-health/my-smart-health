import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Nur Administratoren können Benachrichtigungen löschen' },
        { status: 403 }
      );
    }

    const { notificationId } = (await request.json()) as {
      notificationId: string;
    };

    if (!notificationId) {
      return NextResponse.json(
        { message: 'Notification ID ist erforderlich' },
        { status: 400 }
      );
    }

    await prisma.adminNotification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json(
      { message: 'Benachrichtigung erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist beim Löschen aufgetreten' },
      { status: 500 }
    );
  }
}
