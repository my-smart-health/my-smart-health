import prisma from '@/lib/db';
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

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profileImages: true,
      address: true,
      bio: true,
      phone: true,
      socials: true,
      website: true,
      fieldOfExpertise: true,
      displayEmail: true,
      schedule: true,
      certificates: true,
    },
  });
  return { user };
}

export async function getAllPosts(userId: string) {
  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      photos: true,
      authorId: true,
    },
  });

  return posts;
}
