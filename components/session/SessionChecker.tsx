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

declare global {
  var inactivityTimer: ReturnType<typeof setTimeout> | null;
  var inactivityInterval: NodeJS.Timeout | null;
}

export default function SessionChecker() {
  const { status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const lastUpdateRef = useRef<number>(0);
  const initializedRef = useRef(false);

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
    try {
      document.cookie = `lastActivity=${timestamp}; path=/; SameSite=Lax`;
    } catch { }
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
      document.cookie = `lastActivity=; Max-Age=0; path=/; SameSite=Lax`;
    } catch { }

    try {
      await signOut({ callbackUrl: '/?timeout=1', redirect: true });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/?timeout=1';
    }
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (globalThis.inactivityTimer) {
      clearTimeout(globalThis.inactivityTimer);
      globalThis.inactivityTimer = null;
    }
  }, []);

  const checkInactivity = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const lastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const checksum = localStorage.getItem(CHECKSUM_KEY);

    if (!lastActivity || !checksum) {
      console.log('No activity data found');
      return false;
    }

    const timestamp = parseInt(lastActivity, 10);

    if (!validateChecksum(timestamp, checksum)) {
      console.warn('Activity timestamp tampered with - logging out');
      performLogout();
      return true;
    }

    const timeSinceActivity = Date.now() - timestamp;
    console.log(`Checking inactivity: time since last activity ${Math.floor(timeSinceActivity / 1000 / 60)} minutes`);

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
    globalThis.inactivityTimer = setTimeout(() => {
      const timedOut = checkInactivity();
      if (!timedOut) {
        scheduleInactivityTimer();
      }
    }, remaining);
  }, [checkInactivity, clearInactivityTimer]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const lastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const checksum = localStorage.getItem(CHECKSUM_KEY);
    if (lastActivity && checksum) {
      const ts = parseInt(lastActivity, 10);
      if (isNaN(ts) || !validateChecksum(ts, checksum) || Date.now() - ts > SESSION_TIMEOUT_MS) {
        localStorage.removeItem(ACTIVITY_STORAGE_KEY);
        localStorage.removeItem(CHECKSUM_KEY);
        try {
          document.cookie = `lastActivity=; Max-Age=0; path=/; SameSite=Lax`;
        } catch { }
      }
    }

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

    if (!initializedRef.current) {
      updateActivity();
      initializedRef.current = true;
    }
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
      } else if (document.visibilityState === 'hidden') {
        scheduleInactivityTimer();
      }
    };

    const handleFocus = () => {
      const wasInactive = checkInactivity();
      if (!wasInactive) {
        updateActivity();
        scheduleInactivityTimer();
      }
    };

    const handleBlur = () => {
      scheduleInactivityTimer();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pagehide', scheduleInactivityTimer as EventListener);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pagehide', scheduleInactivityTimer as EventListener);
    };
  }, [status, checkInactivity, updateActivity, scheduleInactivityTimer]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    if (!globalThis.inactivityInterval) {
      globalThis.inactivityInterval = setInterval(() => {
        checkInactivity();
      }, 30000);
    }

    return () => {
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (globalThis.inactivityTimer) {
        clearTimeout(globalThis.inactivityTimer);
        globalThis.inactivityTimer = null;
      }
      if (globalThis.inactivityInterval) {
        clearInterval(globalThis.inactivityInterval);
        globalThis.inactivityInterval = null;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}
