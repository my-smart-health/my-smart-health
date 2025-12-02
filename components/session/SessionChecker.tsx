'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

const SESSION_TIMEOUT_MS = 10 * 60 * 1000;
const ACTIVITY_STORAGE_KEY = 'lastActivity';
const CHECKSUM_KEY = 'activityChecksum';
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/forgot-password',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/agb',
];

const createChecksum = (timestamp: number): string => {
  const hash = (timestamp * 31337 + 42069).toString(36);
  return hash;
};

const validateChecksum = (timestamp: number, checksum: string): boolean => {
  return createChecksum(timestamp) === checksum;
};

export default function SessionChecker() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const lastUpdateRef = useRef<number>(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPublicPath = useCallback(() => {
    return PUBLIC_PATHS.some(
      (path) =>
        pathname === path ||
        pathname?.startsWith('/news/') ||
        pathname?.startsWith('/profile/') ||
        pathname?.startsWith('/smart-health') ||
        pathname?.startsWith('/medizin-und-pflege') ||
        pathname?.startsWith('/notfalle') ||
        pathname?.startsWith('/the-health-bar')
    );
  }, [pathname]);

  const updateActivity = useCallback(() => {
    if (typeof window === 'undefined') return;

    const timestamp = Date.now();
    localStorage.setItem(ACTIVITY_STORAGE_KEY, timestamp.toString());
    localStorage.setItem(CHECKSUM_KEY, createChecksum(timestamp));
  }, []);

  const updateServerSession = useCallback(async () => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 5 * 60 * 1000) {
      lastUpdateRef.current = now;
      try {
        await update();
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }
  }, [update]);

  const performLogout = useCallback(async () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    localStorage.removeItem(CHECKSUM_KEY);

    try {
      await signOut({ callbackUrl: '/', redirect: true });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const checkInactivity = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const lastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const checksum = localStorage.getItem(CHECKSUM_KEY);

    if (!lastActivity || !checksum) {
      return false;
    }

    const timestamp = parseInt(lastActivity, 10);

    if (!validateChecksum(timestamp, checksum)) {
      console.warn('Activity timestamp tampered with - logging out');
      performLogout();
      return true;
    }

    const timeSinceActivity = Date.now() - timestamp;

    if (timeSinceActivity > SESSION_TIMEOUT_MS) {
      console.log(`Session timeout: ${Math.floor(timeSinceActivity / 1000 / 60)} minutes of inactivity`);
      performLogout();
      return true;
    }

    return false;
  }, [performLogout]);

  const scheduleInactivityTimer = useCallback(() => {
    if (typeof window === 'undefined') return;

    const lastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const checksum = localStorage.getItem(CHECKSUM_KEY);
    let remaining = SESSION_TIMEOUT_MS;
    if (lastActivity && checksum) {
      const ts = parseInt(lastActivity, 10);
      if (validateChecksum(ts, checksum)) {
        const since = Date.now() - ts;
        remaining = Math.max(0, SESSION_TIMEOUT_MS - since);
      }
    }

    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      const timedOut = checkInactivity();
      if (!timedOut) {
        scheduleInactivityTimer();
      }
    }, remaining);
  }, [checkInactivity, clearInactivityTimer]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'touchmove',
      'click',
      'wheel',
    ];

    const handleActivity = (e: Event) => {
      if (!e.isTrusted) return;

      updateActivity();
      updateServerSession();
      scheduleInactivityTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    updateActivity();
    scheduleInactivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInactivityTimer();
    };
  }, [status, updateActivity, updateServerSession, scheduleInactivityTimer, clearInactivityTimer]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const wasInactive = checkInactivity();
        if (!wasInactive) {
          updateActivity();
          scheduleInactivityTimer();
        }
      }
    };

    const handleFocus = () => {
      const wasInactive = checkInactivity();
      if (!wasInactive) {
        updateActivity();
        scheduleInactivityTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [status, checkInactivity, updateActivity, scheduleInactivityTimer]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    checkIntervalRef.current = setInterval(() => {
      checkInactivity();
    }, 30000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [status, checkInactivity]);

  useEffect(() => {
    if (status === 'authenticated' && !isPublicPath()) {
      updateServerSession();
    }
  }, [pathname, status, isPublicPath, updateServerSession]);

  useEffect(() => {
    if (status === 'unauthenticated' && !isPublicPath()) {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
      localStorage.removeItem(CHECKSUM_KEY);
      router.push('/');
    }
  }, [status, router, isPublicPath]);

  return null;
}
