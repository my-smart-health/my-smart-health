'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('AppError');

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const isPrismaError = error.message?.includes('Prisma') ||
    error.message?.includes('Accelerate') ||
    error.message?.includes('database');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 gap-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-error">
          {isPrismaError ? t('connectionErrorTitle') : t('genericErrorTitle')}
        </h2>
        <p className="text-base-content mb-6">
          {isPrismaError
            ? t('connectionErrorMessage')
            : t('genericErrorMessage')}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary"
          >
            {t('tryAgain')}
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-outline"
          >
            {t('toHomepage')}
          </button>
        </div>
        {error.digest && (
          <p className="text-xs text-base-content/60 mt-4">
            {t('errorId')} {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
