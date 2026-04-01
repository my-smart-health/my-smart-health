"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function TimeoutModal() {
  const t = useTranslations('TimeoutModal');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const readTimeoutFlag = () => {
      const query = new URLSearchParams(window.location.search);
      setOpen(query.get("timeout") === "1");
    };

    readTimeoutFlag();
    window.addEventListener("popstate", readTimeoutFlag);

    return () => {
      window.removeEventListener("popstate", readTimeoutFlag);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-4 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">{t('title')}</h2>
        <p className="text-sm text-gray-700 mb-4">
          {t('message')}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded bg-black text-white"
            onClick={() => setOpen(false)}
          >
            {t('ok')}
          </button>
        </div>
      </div>
    </div>
  );
}
