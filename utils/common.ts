import { ErrorState, Social } from './types';

export function parseSocials(socials: string[]): Social[] {
  return socials
    .map((s) => {
      const [platform, url] = s.split('|');
      return { platform, url };
    })
    .filter((s) => s.platform && s.url);
}

export function serializeSocials(socials: Social[]): string[] {
  return socials
    .filter((s) => s.platform && s.url)
    .map((s) => `${s.platform}|${s.url}`);
}

export function safeCategory(category: string) {
  return category.replace(/\s+/g, '-').replace(/%26/g, '&');
}

export function unsafeCategory(category: string) {
  return category.replace(/-/g, ' ').replace(/%26/g, '&');
}

export function isYoutubeLink(item: string) {
  const isYoutube = /youtu(be)?/.test(item);
  return isYoutube;
}

export function isInstagramLink(item: string) {
  const isInstagram = /instagram/.test(item);
  return isInstagram;
}

export function getModalColor(
  error: ErrorState | null,
  isDefaultLogo: boolean
) {
  if (!error) return '';
  if (error.type === 'success')
    return isDefaultLogo ? 'bg-yellow-500' : 'bg-green-500';
  if (error.type === 'warning') return 'bg-yellow-500';
  return 'bg-red-500';
}

export function isBlobUrl(url: string) {
  return url.startsWith(process.env.BLOB_URL_PREFIX || '');
}
