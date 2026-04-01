import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ContactTemplate } from '@/components/emails/contact-template/ContactTemplate';
import { resolveLocale } from '@/utils/common';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

const messages = {
  de: {
    required: 'Alle Felder sind erforderlich',
    subjectPrefix: 'Neue Kontaktanfrage von',
    genericError:
      'Fehler beim Senden der Nachricht. Bitte versuchen Sie es spaeter erneut.',
  },
  en: {
    required: 'All fields are required',
    subjectPrefix: 'New contact request from',
    genericError: 'Error sending message. Please try again later.',
  },
} as const;

export async function POST(req: Request) {
  try {
    const locale = resolveLocale(req);
    const t = messages[locale];
    const { name, surname, email, phoneNumber, message } = await req.json();

    if (!name || !surname || !email || !phoneNumber || !message) {
      return NextResponse.json({ error: t.required }, { status: 400 });
    }

    const data = await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        'My Smart Health Kontakt <onboarding@resend.dev>',
      to: process.env.RESEND_TO || 'f.jeute@spitzenmedizin.com',
      replyTo: email,
      subject: `${t.subjectPrefix} ${surname} ${name}`,
      react: ContactTemplate({
        name: name,
        surname: surname,
        email: email,
        phoneNumber: phoneNumber,
        message: message,
        locale,
      }),
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error);
    }
    return NextResponse.json(
      {
        error: messages[resolveLocale(req)].genericError,
      },
      { status: 500 },
    );
  }
}
