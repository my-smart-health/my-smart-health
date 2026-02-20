"use client";

import { useEffect, useRef, useState } from "react";
import { Cookie } from "lucide-react";
import CookieActionButtons from "./CookieActionButtons";

const STORAGE_KEY = "msh_cookie_consent_v2";
const STORAGE_PREFERENCES = "msh_cookie_preferences_v2";
const STORAGE_SNOOZE_KEY = "msh_cookie_consent_snooze_v2";
const EVENT_OPEN = "msh:cookie:open";

export interface CookiePreferences {
  technical: boolean;
  analytics: boolean;
  socialMedia: boolean;
  timestamp: number;
}

export default function CookieConsentModal() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    technical: true,
    analytics: false,
    socialMedia: false,
    timestamp: Date.now(),
  });
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const consentRaw = window.localStorage.getItem(STORAGE_KEY);
      const prefsRaw = window.localStorage.getItem(STORAGE_PREFERENCES);
      const snoozeRaw = window.localStorage.getItem(STORAGE_SNOOZE_KEY);
      const now = Date.now();
      const snoozeUntil = snoozeRaw ? parseInt(snoozeRaw, 10) : 0;

      if (prefsRaw) {
        try {
          const saved = JSON.parse(prefsRaw);
          setPreferences(saved);
        } catch {
        }
      }

      if (!consentRaw && now > snoozeUntil) {
        const t = setTimeout(() => setOpen(true), 400);
        return () => clearTimeout(t);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Cookie consent: localStorage unavailable", error);
      }
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener(EVENT_OPEN, onOpen as EventListener);
    return () => window.removeEventListener(EVENT_OPEN, onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (open && acceptBtnRef.current) {
      acceptBtnRef.current.focus();
    }
  }, [open]);

  function accept() {
    try {
      const allAccepted: CookiePreferences = {
        technical: true,
        analytics: true,
        socialMedia: true,
        timestamp: Date.now(),
      };
      setPreferences(allAccepted);
      window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
      window.localStorage.setItem(STORAGE_PREFERENCES, JSON.stringify(allAccepted));
      window.localStorage.removeItem(STORAGE_SNOOZE_KEY);
      window.dispatchEvent(new CustomEvent("msh:cookie:changed", { detail: allAccepted }));
    } catch { }
    setOpen(false);
  }

  function saveCustomPreferences() {
    try {
      const updated = { ...preferences, timestamp: Date.now() };
      setPreferences(updated);
      window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
      window.localStorage.setItem(STORAGE_PREFERENCES, JSON.stringify(updated));
      window.localStorage.removeItem(STORAGE_SNOOZE_KEY);
      window.dispatchEvent(new CustomEvent("msh:cookie:changed", { detail: updated }));
    } catch { }
    setOpen(false);
  }

  function close() {
    try {
      const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
      window.localStorage.setItem(STORAGE_SNOOZE_KEY, (Date.now() + THIRTY_DAYS).toString());
    } catch { }
    setOpen(false);
  }

  function decline() {
    try {
      const technicalOnly: CookiePreferences = {
        technical: true,
        analytics: false,
        socialMedia: false,
        timestamp: Date.now(),
      };
      setPreferences(technicalOnly);
      window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
      window.localStorage.setItem(STORAGE_PREFERENCES, JSON.stringify(technicalOnly));
      window.localStorage.removeItem(STORAGE_SNOOZE_KEY);
      window.dispatchEvent(new CustomEvent("msh:cookie:changed", { detail: technicalOnly }));
    } catch { }
    setOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const buttons = [
    {
      label: "Ablehnen",
      onClick: decline,
      className: "btn btn-outline btn-error flex-1 min-w-[100px]",
      ariaLabel: "Nur technisch notwendige Cookies",
    },
    {
      label: "Später entscheiden",
      onClick: close,
      className: "btn btn-outline flex-1 min-w-[100px] py-6",
      ariaLabel: "Meldung für 30 Tage ausblenden",
    },
    {
      label: "Auswahl speichern",
      onClick: saveCustomPreferences,
      className: "btn btn-outline btn-success flex-1 min-w-[100px] py-6",
      ariaLabel: "Ausgewählte Cookie-Kategorien speichern",
    },
    {
      label: "Alle akzeptieren",
      onClick: accept,
      className: "btn btn-primary flex-1 min-w-[100px] py-6",
      ref: acceptBtnRef,
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        className="relative bg-white text-black rounded-lg shadow-2xl border-2 border-primary max-w-md w-full p-6 z-10 max-h-[calc(100vh-2rem)] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-desc"
      >
        <div className="flex items-center gap-2 mb-4">
          <Cookie className="text-primary w-6 h-6" />
          <h2 id="cookie-consent-title" className="font-semibold text-lg">
            Cookies & Lokal Speicherung
          </h2>
        </div>

        <div id="cookie-consent-desc" className="text-sm leading-relaxed space-y-3 mb-6">
          <p>
            Diese Website verwendet technisch notwendige Cookies und lokale Speicherung (LocalStorage),
            um die Funktionalität der Website zu gewährleisten und Ihre Nutzererfahrung zu verbessern.
          </p>
          <p>
            Zusätzlich können Drittanbieter-Inhalte wie <strong>YouTube-Videos (Google)</strong> und{" "}
            <strong>Instagram-Reels (Meta)</strong> eingebettet werden, die eigene Cookies setzen und
            Daten erfassen können.
          </p>

          {showDetails && (
            <div className="border border-gray-300 rounded-lg p-3 space-y-3 bg-gray-50">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="cookie-technical"
                  checked={preferences.technical}
                  disabled
                  className="checkbox checkbox-sm checkbox-primary mt-0.5"
                />
                <label htmlFor="cookie-technical" className="cursor-not-allowed">
                  <div className="font-semibold text-gray-700">Technisch notwendig</div>
                  <div className="text-xs text-gray-600">
                    Erforderlich für grundlegende Funktionen (z.B. Session, Login). Kann nicht deaktiviert werden.
                  </div>
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="cookie-analytics"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="checkbox checkbox-sm checkbox-primary mt-0.5"
                />
                <label htmlFor="cookie-analytics" className="cursor-pointer">
                  <div className="font-semibold text-gray-700">Analyse & Statistik</div>
                  <div className="text-xs text-gray-600">
                    Hilft uns, die Website-Nutzung zu verstehen und zu verbessern.
                  </div>
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="cookie-social"
                  checked={preferences.socialMedia}
                  onChange={(e) => setPreferences({ ...preferences, socialMedia: e.target.checked })}
                  className="checkbox checkbox-sm checkbox-primary mt-0.5"
                />
                <label htmlFor="cookie-social" className="cursor-pointer">
                  <div className="font-semibold text-gray-700">Social Media & Externe Inhalte</div>
                  <div className="text-xs text-gray-600">
                    YouTube-Videos (Google), Instagram-Reels (Meta). Diese Dienste setzen eigene Cookies
                    und können Ihr Nutzungsverhalten tracken.
                  </div>
                </label>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary underline text-xs font-medium hover:opacity-80"
          >
            {showDetails ? "Weniger anzeigen" : "Cookie-Kategorien anzeigen"}
          </button>

          <p className="text-xs pt-2 border-t border-gray-200 mt-3">
            Weitere Informationen finden Sie in unserer{" "}
            <a href="/datenschutz" className="link link-primary underline font-medium">Datenschutzerklärung</a>,{" "}
            <a href="/agb" className="link link-primary underline font-medium">AGB</a>,{" "}
            <a href="/impressum" className="link link-primary underline font-medium">Impressum</a> und{" "}
            <a href="/kontakt" className="link link-primary underline font-medium">Kontakt</a>.
          </p>
        </div>
        <CookieActionButtons buttons={buttons} />
      </div>
    </div>
  );
}
