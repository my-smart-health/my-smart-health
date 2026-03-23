"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { AppLocale, LOCALE_OPTIONS, resolveLocale } from "@/i18n/locales";

export default function LocalePicker() {
  const locale = resolveLocale(useLocale());
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentLocaleOption = LOCALE_OPTIONS.find((option) => option.locale === locale) ?? LOCALE_OPTIONS[0];

  const setLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;

    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });

      router.refresh();
    });
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-sm h-8 min-h-8 w-8 p-1 rounded-md" aria-disabled={isPending}>
        <Image
          src={currentLocaleOption.flagSrc}
          alt={currentLocaleOption.name}
          width={20}
          height={15}
          className="h-[15px] w-[20px]"
        />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu mt-1 p-1 shadow bg-base-100 rounded-box w-auto min-w-[120px] border border-primary"
      >
        {LOCALE_OPTIONS.map((option) => (
          <li key={option.locale}>
            <button
              type="button"
              onClick={() => setLocale(option.locale)}
              disabled={isPending || locale === option.locale}
              aria-label={option.name}
              className="flex items-center gap-2 px-2 py-1.5 text-sm"
            >
              <Image
                src={option.flagSrc}
                alt={option.name}
                width={20}
                height={15}
                className="h-[15px] w-[20px]"
              />
              <span>{option.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}