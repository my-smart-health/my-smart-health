'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          {isPrismaError ? 'Verbindungsfehler' : 'Etwas ist schiefgelaufen'}
        </h2>
        <p className="text-base-content mb-6">
          {isPrismaError
            ? 'Wir haben Probleme, die Daten zu laden. Bitte versuchen Sie es erneut.'
            : 'Ein unerwarteter Fehler ist aufgetreten.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary"
          >
            Erneut versuchen
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-outline"
          >
            Zur Startseite
          </button>
        </div>
        {error.digest && (
          <p className="text-xs text-base-content/60 mt-4">
            Fehler-ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
