'use client'

import { useTranslations } from 'next-intl';
import Link from "next/link";

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <>
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="mt-4">{t('description')}</p>
      <Link className="mt-4 px-4 py-2 bg-primary text-white rounded" href="/">{t('goBack')}</Link>
    </>
  );
}
