"use client";

import { useMemo } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useCookieConsent } from "@/lib/useCookieConsent";

export default function AnalyticsConsent() {
  const { analytics } = useCookieConsent();

  const enabled = useMemo(() => analytics, [analytics]);

  if (!enabled) return null;
  return <Analytics />;
}
