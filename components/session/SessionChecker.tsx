'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

const SESSION_TIMEOUT_MS = 10 * 60 * 1000;
const ACTIVITY_STORAGE_KEY = 'lastActivity';
const CHECKSUM_KEY = 'activityChecksum';
const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/kontakt', '/impressum', '/datenschutz', '/agb'];

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

  const isPublicPath = useCallback(() => {
    return PUBLIC_PATHS.some(path =>
      pathname === path ||
      pathname?.startsWith('/news/') ||
      pathname?.startsWith('/profile/') ||
      pathname?.startsWith('/smart-health') ||
      pathname?.startsWith('/medizin-und-pflege') ||
      pathname?.startsWith('/notfalle') ||
      pathname?.startsWith('/the-health-bar')
    );
  }, [pathname]);

  const updateLocalActivity = useCallback(() => {
    if (typeof window !== 'undefined') {
      const timestamp = Date.now();
      localStorage.setItem(ACTIVITY_STORAGE_KEY, timestamp.toString());
      localStorage.setItem(CHECKSUM_KEY, createChecksum(timestamp));
    }
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

  useEffect(() => {
    if (!session || status !== 'authenticated') return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      updateLocalActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    updateLocalActivity();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [session, status, updateLocalActivity]);

  useEffect(() => {
    if (!session || status !== 'authenticated') return;

    const timeoutChecker = setInterval(() => {
      if (typeof window !== 'undefined') {
        const lastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        const checksum = localStorage.getItem(CHECKSUM_KEY);

        if (lastActivity && checksum) {
          const timestamp = parseInt(lastActivity, 10);

          if (!validateChecksum(timestamp, checksum)) {
            console.warn('Activity timestamp tampered with - logging out');
            localStorage.removeItem(ACTIVITY_STORAGE_KEY);
            localStorage.removeItem(CHECKSUM_KEY);
            router.push('/');
            return;
          }

          const timeSinceActivity = Date.now() - timestamp;

          if (timeSinceActivity > SESSION_TIMEOUT_MS) {
            localStorage.removeItem(ACTIVITY_STORAGE_KEY);
            localStorage.removeItem(CHECKSUM_KEY);
            router.push('/');
          }
        }
      }
    }, 60000);

    return () => clearInterval(timeoutChecker);
  }, [session, status, router]);

  useEffect(() => {
    if (session && status === 'authenticated' && !isPublicPath()) {
      updateServerSession();
    }
  }, [pathname, session, status, isPublicPath, updateServerSession]);

  useEffect(() => {
    if (status === 'unauthenticated' && !isPublicPath()) {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
      localStorage.removeItem(CHECKSUM_KEY);
      router.push('/');
    }
  }, [status, router, isPublicPath]);

  return null;
}
