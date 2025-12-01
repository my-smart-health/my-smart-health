import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { auth } from '@/auth';

function generateSimplePassword(): string {
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const allChars = lowercase + uppercase + numbers;

  let password = '';
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));

  for (let i = 0; i < 5; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Nur Administratoren können Passwörter zurücksetzen' },
        { status: 403 }
      );
    }

    const { notificationId, email } = (await request.json()) as {
      notificationId: string;
      email: string;
    };

    if (!notificationId || !email) {
      return NextResponse.json(
        { message: 'Notification ID und E-Mail sind erforderlich' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    const newPassword = generateSimplePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.adminNotification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        resetReadAt: new Date(),
        archivedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: 'Passwort erfolgreich zurückgesetzt',
        newPassword,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist beim Zurücksetzen des Passworts aufgetreten' },
      { status: 500 }
    );
  }
}
