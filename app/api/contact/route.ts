import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ContactTemplate } from '@/components/emails/contact-template/ContactTemplate';

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
      react: ContactTemplate({
        name: name,
        surname: surname,
        email: email,
        phoneNumber: phoneNumber,
        message: message,
      }),
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
