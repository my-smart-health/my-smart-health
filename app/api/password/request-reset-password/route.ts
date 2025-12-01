import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
      await resend.emails.send({
        from:
          process.env.RESEND_FROM ||
          'My Smart Health Admin <onboarding@resend.dev>',
        to: process.env.RESEND_TO || 'f.jeute@spitzenmedizin.com',
        subject: '🔔 Neue Passwort-Zurücksetzungsanfrage',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2db9bc;">Neue Passwort-Zurücksetzungsanfrage</h2>
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">
                <strong>⚠️ Eine neue Anfrage zum Zurücksetzen des Passworts wurde eingereicht.</strong>
              </p>
            </div>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Benutzer E-Mail:</strong> <a href="mailto:${
                user.email
              }" style="color: #2db9bc;">${user.email}</a></p>
              ${user.name ? `<p><strong>Name:</strong> ${user.name}</p>` : ''}
              <p><strong>Zeitpunkt:</strong> ${new Date().toLocaleString(
                'de-DE',
                {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }
              )}</p>
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #e7f9f9; border-radius: 8px;">
              <h3 style="color: #2db9bc; margin-top: 0;">Nächste Schritte:</h3>
              <ol style="line-height: 1.8;">
                <li>Melden Sie sich im Admin-Dashboard an</li>
                <li>Navigieren Sie zu "Passwort-Zurücksetzungsanfragen"</li>
                <li>Überprüfen Sie die Anfrage und setzen Sie das Passwort zurück</li>
                <li>Teilen Sie das neue Passwort dem Benutzer mit</li>
              </ol>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${
                process.env.NEXT_PUBLIC_APP_URL || 'https://mysmart.health'
              }/dashboard/password-requests" 
                 style="display: inline-block; padding: 12px 24px; background-color: #2db9bc; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Anfragen verwalten
              </a>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="color: #666; font-size: 12px; text-align: center;">
              Diese Benachrichtigung wurde automatisch von My Smart Health gesendet.
            </p>
          </div>
        `,
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
