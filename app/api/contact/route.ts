import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, surname, email, phoneNumber, message } = await req.json();

    if (!name || !surname || !email || !phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        'My Smart Health Kontakt <onboarding@resend.dev>',
      to: process.env.RESEND_TO || 'radoslav.marinov89@gmail.com',
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${surname} ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2db9bc;">Neue Kontaktformular-Nachricht</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Vorname:</strong> ${surname}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Telefon:</strong> ${phoneNumber}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #2db9bc;">Nachricht:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #666; font-size: 12px;">Diese Nachricht wurde über das Kontaktformular auf My Smart Health gesendet.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error);
    }
    return NextResponse.json(
      {
        error:
          'Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    );
  }
}
