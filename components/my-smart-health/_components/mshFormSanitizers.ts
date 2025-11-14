import type { MySmartHealthParagraph, Schedule } from '@/utils/types';
import {
  sanitizePhoneList,
  sanitizeScheduleList,
} from '@/components/profile/edit-profile-form/formSanitizers';

export type MySmartHealthFormLocation = {
  id: string;
  address: string;
  phone: string[];
  schedule: Schedule[] | null;
  mySmartHealthId?: string | null;
};

export type SanitizedMySmartHealthLocation = {
  id: string;
  address: string;
  phone: string[];
  schedule: Schedule[] | null;
  mySmartHealthId?: string;
};

export type MySmartHealthPayload = {
  id?: string;
  generalTitle: string;
  paragraph: MySmartHealthParagraph[];
};

export type BuildMySmartHealthPayloadArgs = {
  id?: string | null;
  generalTitle: unknown;
  paragraphs: MySmartHealthParagraph[] | null | undefined;
};

const asTrimmedString = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (value instanceof String) return value.valueOf().trim();
  if (value === undefined || value === null) return '';
  return String(value).trim();
};

const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toStringArray = (
  values: Array<string | null | undefined> | null | undefined
): string[] => {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);
};

const sanitizeMediaList = (
  mediaList: Array<string | null | undefined> | null | undefined
): string[] => {
  const unique = new Set<string>();
  const sanitized: string[] = [];

  toStringArray(mediaList).forEach((entry) => {
    if (unique.has(entry)) return;
    unique.add(entry);
    sanitized.push(entry);
  });

  return sanitized;
};

const sanitizeFileList = (
  files: Array<string | null | undefined> | null | undefined
): string[] => {
  const unique = new Set<string>();
  const sanitized: string[] = [];

  toStringArray(files).forEach((file) => {
    if (unique.has(file)) return;
    unique.add(file);
    sanitized.push(file);
  });

  return sanitized;
};

const sanitizeSocialLinks = (
  links:
    | Array<{ platform?: unknown; url?: unknown } | null | undefined>
    | null
    | undefined
): { platform: string; url: string }[] => {
  if (!Array.isArray(links)) return [];
  const seen = new Set<string>();

  return links.reduce<{ platform: string; url: string }[]>((acc, link) => {
    if (!link || typeof link !== 'object') return acc;
    const platform = asTrimmedString(link.platform);
    const url = asTrimmedString(link.url);
    if (!platform || !url) return acc;
    const key = `${platform.toLowerCase()}::${url.toLowerCase()}`;
    if (seen.has(key)) return acc;
    seen.add(key);
    acc.push({ platform, url });
    return acc;
  }, []);
};

const sanitizeParagraphList = (
  paragraphs: MySmartHealthParagraph[] | null | undefined
): MySmartHealthParagraph[] => {
  if (!Array.isArray(paragraphs)) return [];

  return paragraphs.reduce<MySmartHealthParagraph[]>((acc, paragraph) => {
    if (!paragraph || typeof paragraph !== 'object') return acc;
    const id = asTrimmedString((paragraph as { id?: unknown }).id);
    if (!id) return acc;

    const title = asTrimmedString(paragraph.title);
    const content =
      typeof paragraph.content === 'string' ? paragraph.content : '';
    const textContent = stripHtml(content);
    const images = sanitizeMediaList(paragraph.images);
    const files = sanitizeFileList(paragraph.files);
    const socialLinks = sanitizeSocialLinks(paragraph.socialLinks);

    const hasContent =
      Boolean(title) ||
      Boolean(textContent) ||
      images.length > 0 ||
      files.length > 0 ||
      socialLinks.length > 0;
    if (!hasContent) return acc;

    const sanitizedParagraph: MySmartHealthParagraph = {
      id,
      content,
    };

    if (title) {
      sanitizedParagraph.title = title;
    }

    if (images.length > 0) {
      sanitizedParagraph.images = images;
    }

    if (files.length > 0) {
      sanitizedParagraph.files = files;
    }

    if (socialLinks.length > 0) {
      sanitizedParagraph.socialLinks = socialLinks;
    }

    acc.push(sanitizedParagraph);
    return acc;
  }, []);
};

export const buildMySmartHealthPayload = (
  payloadArgs: BuildMySmartHealthPayloadArgs
): MySmartHealthPayload => {
  const generalTitle = asTrimmedString(payloadArgs.generalTitle);
  const paragraph = sanitizeParagraphList(payloadArgs.paragraphs);
  const id = asTrimmedString(payloadArgs.id);

  const payload: MySmartHealthPayload = {
    generalTitle,
    paragraph,
  };

  if (id) {
    payload.id = id;
  }

  return payload;
};

export const sanitizeLocationsForPersistence = (
  locations:
    | Array<MySmartHealthFormLocation | null | undefined>
    | null
    | undefined
): SanitizedMySmartHealthLocation[] => {
  if (!Array.isArray(locations)) return [];

  return locations.reduce<SanitizedMySmartHealthLocation[]>((acc, location) => {
    if (!location || typeof location !== 'object') return acc;
    const id = asTrimmedString(location.id);
    if (!id) return acc;

    const address = asTrimmedString(location.address);
    const phone = Array.isArray(location.phone)
      ? sanitizePhoneList(location.phone)
      : sanitizePhoneList([location.phone as string]);
    const scheduleEntries = Array.isArray(location.schedule)
      ? sanitizeScheduleList(location.schedule)
      : [];
    const schedule = scheduleEntries.length > 0 ? scheduleEntries : null;
    const mySmartHealthId = asTrimmedString(location.mySmartHealthId);

    acc.push({
      id,
      address,
      phone,
      schedule,
      ...(mySmartHealthId ? { mySmartHealthId } : {}),
    });
    return acc;
  }, []);
};
