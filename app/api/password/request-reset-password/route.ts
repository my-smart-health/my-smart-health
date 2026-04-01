import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ResetPasswordRequest } from '@/components/emails/reset-password-request/ResetPasswordRequest';
import { resolveLocale } from '@/utils/common';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

const messages = {
  de: {
    emailRequired: 'E-Mail-Adresse ist erforderlich',
    emailNotFound: 'Die E-Mail-Adresse existiert nicht in unserem System.',
    pendingExists:
      'Es gibt bereits eine ausstehende Anfrage fuer diese E-Mail-Adresse. Bitte warten Sie auf die Bearbeitung durch den Administrator.',
    notificationMessagePrefix: 'Passwort-Zuruecksetzung angefordert fuer:',
    emailSubject: 'Neue Passwort-Zuruecksetzungsanfrage',
    success:
      'Anfrage erfolgreich gesendet. Der Administrator wird sich mit Ihnen in Verbindung setzen.',
    genericError:
      'Ein Fehler ist aufgetreten. Bitte kontaktieren Sie den Administrator direkt.',
  },
  en: {
    emailRequired: 'Email address is required',
    emailNotFound: 'The email address does not exist in our system.',
    pendingExists:
      'There is already a pending request for this email address. Please wait for the administrator to process it.',
    notificationMessagePrefix: 'Password reset requested for:',
    emailSubject: 'New password reset request',
    success: 'Request sent successfully. The administrator will contact you.',
    genericError:
      'An error occurred. Please contact the administrator directly.',
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const locale = resolveLocale(request);
    const t = messages[locale];

    const { email } = (await request.json()) as { email: string };

    if (!email || !email.trim()) {
      return NextResponse.json({ message: t.emailRequired }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ message: t.emailNotFound }, { status: 404 });
    }

    const existingRequest = await prisma.adminNotification.findFirst({
      where: {
        message: { contains: user.email },
        isRead: false,
        archivedAt: null,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          message: t.pendingExists,
        },
        { status: 409 },
      );
    }

    await prisma.adminNotification.create({
      data: {
        message: `${t.notificationMessagePrefix} ${user.email}${
          user.name ? ` (${user.name})` : ''
        }`,
        isRead: false,
      },
    });

    try {
      const timestamp = new Date().toLocaleString(
        locale === 'de' ? 'de-DE' : 'en-US',
        {
          dateStyle: 'full',
          timeStyle: 'short',
        },
      );
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://mysmart.health'}/dashboard/password-requests`;

      await resend.emails.send({
        from:
          process.env.RESEND_FROM ||
          'My Smart Health Admin <onboarding@resend.dev>',
        to: process.env.RESEND_TO || 'f.jeute@spitzenmedizin.com',
        subject: `🔔 ${t.emailSubject}`,
        react: ResetPasswordRequest({
          email: user.email,
          name: user.name,
          timestamp,
          dashboardUrl,
          locale,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    return NextResponse.json({ message: t.success }, { status: 200 });
  } catch (error) {
    console.error('Error creating password reset request:', error);
    const locale = resolveLocale(request);
    return NextResponse.json(
      { message: messages[locale].genericError },
      { status: 500 },
    );
  }
}
