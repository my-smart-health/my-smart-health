'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SESSION_CHECK_INTERVAL_MS } from '@/utils/constants';

export default function SessionChecker() {
  const router = useRouter();
  const { data: session, update } = useSession();

  // Function to update session activity
  const updateActivity = useCallback(async () => {
    if (session) {
      await update();
    }
  }, [session, update]);

  useEffect(() => {
    // Activity tracking
    let lastActivityTime = Date.now();
    const ACTIVITY_THROTTLE = 60 * 1000; // Update at most once per minute

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > ACTIVITY_THROTTLE) {
        lastActivityTime = now;
        updateActivity();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [updateActivity]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();

        if (!sessionData || !sessionData.user) {
          router.push('/');
          router.refresh();
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Session check failed:', error);
        }
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
