import { Social } from '@/utils/types';

export type CreatePostPayload = {
  authorId: string;
  title: string;
  content: string;
  photos: string[];
  tags: string[];
  socialLinks: Social[];
};

export type UpdatePostPayload = {
  id: string;
  title: string;
  content: string;
  photos: string[];
  tags: string[];
  socialLinks: Social[];
};

export type CreatePostRequestData = {
  authorId: string;
  title: FormDataEntryValue | string | null;
  content: string;
  photos: Array<string | null | undefined> | null | undefined;
  tags: Array<string | null | undefined> | null | undefined;
  socialLinks: Array<Partial<Social> | null | undefined> | null | undefined;
};

export type UpdatePostRequestData = {
  id: string | null | undefined;
  title: FormDataEntryValue | string | null;
  content: string;
  photos: Array<string | null | undefined> | null | undefined;
  tags: Array<string | null | undefined> | null | undefined;
  socialLinks: Array<Partial<Social> | null | undefined> | null | undefined;
};

const asTrimmedString = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (value instanceof String) return value.valueOf().trim();
  if (value === undefined || value === null) return '';
  return String(value).trim();
};

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
): string[] => Array.from(new Set(toStringArray(mediaList)));

const sanitizeTagList = (
  tags: Array<string | null | undefined> | null | undefined
): string[] => {
  const seen = new Set<string>();
  const sanitized: string[] = [];

  toStringArray(tags).forEach((tag) => {
    const key = tag.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    sanitized.push(tag);
  });

  return sanitized;
};

const sanitizeSocialLinkList = (
  links: Array<Partial<Social> | null | undefined> | null | undefined
): Social[] => {
  if (!Array.isArray(links)) return [];
  const seen = new Set<string>();

  return links.reduce<Social[]>((acc, link) => {
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

export const buildCreatePostPayload = (
  postPayload: CreatePostRequestData
): CreatePostPayload => ({
  authorId: asTrimmedString(postPayload.authorId),
  title: asTrimmedString(postPayload.title),
  content: postPayload.content,
  photos: sanitizeMediaList(postPayload.photos),
  tags: sanitizeTagList(postPayload.tags),
  socialLinks: sanitizeSocialLinkList(postPayload.socialLinks),
});

export const buildUpdatePostPayload = (
  updatePost: UpdatePostRequestData
): UpdatePostPayload => ({
  id: asTrimmedString(updatePost.id),
  title: asTrimmedString(updatePost.title),
  content: updatePost.content,
  photos: sanitizeMediaList(updatePost.photos),
  tags: sanitizeTagList(updatePost.tags),
  socialLinks: sanitizeSocialLinkList(updatePost.socialLinks),
});
