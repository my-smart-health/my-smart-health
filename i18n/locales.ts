export const SUPPORTED_LOCALES = ['de', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'de';

export const LOCALE_OPTIONS: Array<{
  locale: AppLocale;
  flagSrc: string;
  name: string;
}> = [
  { locale: 'de', flagSrc: '/flags/de.svg', name: 'Deutsche' },
  { locale: 'en', flagSrc: '/flags/gb.svg', name: 'English' },
];

export function isSupportedLocale(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(input?: string): AppLocale {
  if (input && isSupportedLocale(input)) {
    return input;
  }

  return DEFAULT_LOCALE;
}
