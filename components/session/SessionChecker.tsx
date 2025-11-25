'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { SESSION_CHECK_INTERVAL_MS } from '@/utils/constants';

export default function SessionChecker() {
  const { data: session, status, update } = useSession();
  const lastActivityRef = useRef(Date.now());
  const updateInProgressRef = useRef(false);

  const updateActivity = useCallback(async () => {
    const ACTIVITY_THROTTLE = 60 * 1000;
    const now = Date.now();
    const timeSinceLastUpdate = now - lastActivityRef.current;

    if (
      timeSinceLastUpdate > ACTIVITY_THROTTLE &&
      session &&
      !updateInProgressRef.current
    ) {
      updateInProgressRef.current = true;
      try {
        await update({ lastActivity: Date.now() });
        lastActivityRef.current = now;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to update activity:', error);
        }
      } finally {
        updateInProgressRef.current = false;
      }
    }
  }, [session, update]); useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const handleActivity = () => {
      updateActivity();
    };

    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [status, session, updateActivity]);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    let interval: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();

        if (!sessionData || !sessionData.user) {
          clearInterval(interval);
          await signOut({ callbackUrl: '/' });
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
  }, [status, session]);

  return null;
}
