'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SESSION_CHECK_INTERVAL_MS } from '@/utils/constants';

export default function SessionChecker() {
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (!session || !session.user) {
          router.push('/');
          router.refresh();
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
        interval = setInterval(checkSession, SESSION_CHECK_INTERVAL_MS);
      } else {
        clearInterval(interval);
      }
    };

    interval = setInterval(checkSession, SESSION_CHECK_INTERVAL_MS);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  return null;
}
