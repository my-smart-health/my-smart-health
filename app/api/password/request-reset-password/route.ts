import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ResetPasswordRequest } from '@/components/emails/reset-password-request/ResetPasswordRequest';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email: string };

    if (!email || !email.trim()) {
      return NextResponse.json(
        { message: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Die E-Mail-Adresse existiert nicht in unserem System.' },
        { status: 404 }
      );
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
          message:
            'Es gibt bereits eine ausstehende Anfrage für diese E-Mail-Adresse. Bitte warten Sie auf die Bearbeitung durch den Administrator.',
        },
        { status: 409 }
      );
    }

    await prisma.adminNotification.create({
      data: {
        message: `Passwort-Zurücksetzung angefordert für: ${user.email}${
          user.name ? ` (${user.name})` : ''
        }`,
        isRead: false,
      },
    });

    try {
      const timestamp = new Date().toLocaleString('de-DE', {
        dateStyle: 'full',
        timeStyle: 'short',
      });
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://mysmart.health'}/dashboard/password-requests`;

      await resend.emails.send({
        from:
          process.env.RESEND_FROM ||
          'My Smart Health Admin <onboarding@resend.dev>',
        to: process.env.RESEND_TO || 'f.jeute@spitzenmedizin.com',
        subject: '🔔 Neue Passwort-Zurücksetzungsanfrage',
        react: ResetPasswordRequest({
          email: user.email,
          name: user.name,
          timestamp,
          dashboardUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    return NextResponse.json(
      {
        message:
          'Anfrage erfolgreich gesendet. Der Administrator wird sich mit Ihnen in Verbindung setzen.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating password reset request:', error);
    return NextResponse.json(
      {
        message:
          'Ein Fehler ist aufgetreten. Bitte kontaktieren Sie den Administrator direkt.',
      },
      { status: 500 }
    );
  }
}
