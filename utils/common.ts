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
