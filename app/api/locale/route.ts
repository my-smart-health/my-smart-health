import { NextResponse } from 'next/server';
import { isSupportedLocale } from '@/i18n/locales';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: string };

    if (!body?.locale || !isSupportedLocale(body.locale)) {
      return NextResponse.json(
        { error: 'Unsupported locale' },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ ok: true, locale: body.locale });
    response.cookies.set('NEXT_LOCALE', body.locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
