"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LOCALE_STORAGE_KEY, resolveLocale } from "@/i18n/locales";

function getCookieLocale(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="));

  if (!match) return undefined;
  return match.slice("NEXT_LOCALE=".length);
}

export default function LocaleSync() {
  const router = useRouter();
  const currentLocale = resolveLocale(useLocale());
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    let storedLocaleRaw: string | null = null;
    try {
      storedLocaleRaw = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      return;
    }

    const storedLocale = resolveLocale(storedLocaleRaw ?? undefined);

    if (!storedLocaleRaw) {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale);
      } catch {
      }
      return;
    }

    const cookieLocale = resolveLocale(getCookieLocale());

    if (cookieLocale === storedLocale && currentLocale === storedLocale) return;

    (async () => {
      try {
        await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: storedLocale }),
        });

        if (currentLocale !== storedLocale) {
          router.refresh();
        }
      } catch {
      }
    })();
  }, [currentLocale, router]);

  return null;
}
