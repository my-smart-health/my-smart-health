import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NewsNotFound() {
  const t = await getTranslations('NewsPostNotFoundPage');

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
      <p className="text-gray-600">
        {t('description')}
      </p>
      <Link
        href="/news"
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t('backButton')}
      </Link>
    </div>
  );
}
