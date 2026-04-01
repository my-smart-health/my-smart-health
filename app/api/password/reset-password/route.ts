import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { auth } from '@/auth';
import { resolveLocale } from '@/utils/common';

const messages = {
  de: {
    adminOnly: 'Nur Administratoren koennen Passwoerter zuruecksetzen',
    paramsRequired: 'Notification-ID und E-Mail sind erforderlich',
    userNotFound: 'Benutzer nicht gefunden',
    success: 'Passwort erfolgreich zurueckgesetzt',
    genericError: 'Ein Fehler ist beim Zuruecksetzen des Passworts aufgetreten',
  },
  en: {
    adminOnly: 'Only administrators can reset passwords',
    paramsRequired: 'Notification ID and email are required',
    userNotFound: 'User not found',
    success: 'Password reset successfully',
    genericError: 'An error occurred while resetting the password',
  },
} as const;

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
    const locale = resolveLocale(request);
    const t = messages[locale];

    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: t.adminOnly }, { status: 403 });
    }

    const { notificationId, email } = (await request.json()) as {
      notificationId: string;
      email: string;
    };

    if (!notificationId || !email) {
      return NextResponse.json({ message: t.paramsRequired }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ message: t.userNotFound }, { status: 404 });
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
        message: t.success,
        email: user.email,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    const locale = resolveLocale(request);
    return NextResponse.json(
      { message: messages[locale].genericError },
      { status: 500 },
    );
  }
}
