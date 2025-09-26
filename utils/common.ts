import { Social } from './types';

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
