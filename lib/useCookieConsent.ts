'use client';

import { useEffect, useState } from 'react';

export interface CookiePreferences {
  technical: boolean;
  analytics: boolean;
  socialMedia: boolean;
  timestamp: number;
}

const STORAGE_PREFERENCES = 'msh_cookie_preferences_v2';

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    technical: true,
    analytics: false,
    socialMedia: false,
    timestamp: 0,
  });

  useEffect(() => {
    const loadPreferences = () => {
      try {
        const prefsRaw = window.localStorage.getItem(STORAGE_PREFERENCES);
        if (prefsRaw) {
          const saved = JSON.parse(prefsRaw);
          setPreferences(saved);
        }
      } catch {}
    };

    loadPreferences();

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<CookiePreferences>;
      if (customEvent.detail) {
        setPreferences(customEvent.detail);
      }
    };

    window.addEventListener(
      'msh:cookie:changed',
      handleChange as EventListener
    );
    return () =>
      window.removeEventListener(
        'msh:cookie:changed',
        handleChange as EventListener
      );
  }, []);

  return preferences;
}
