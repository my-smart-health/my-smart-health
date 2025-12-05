import { auth } from "@/auth";
import prisma from "@/lib/db";
import { withRetry } from "@/lib/prisma-retry";

import { CACHE_STRATEGY } from "@/utils/constants";
import { NewsCardType, Social } from "@/utils/types";
import NewsList from "@/components/posts/news-list/NewsList";

async function getData(isAdmin: boolean) {
  const cacheStrategy = isAdmin ? CACHE_STRATEGY.NONE : CACHE_STRATEGY.SHORT;

  const posts = await withRetry(() => prisma.posts.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      photos: true,
      tags: true,
      socialLinks: true,
      author: {
        select: {
          id: true,
          name: true,
          fieldOfExpertise: true,
        }
      }
    },
    cacheStrategy,
  })).catch((error) => {
    console.error('Error fetching news posts:', error);
    return [];
  });

  return posts.map((post) => ({
    ...post,
    socialLinks: Array.isArray(post.socialLinks) ? (post.socialLinks as unknown as Social[]) : []
  }));
}

export default async function NewsPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';
  const posts = await getData(isAdmin) as NewsCardType[];

  return <NewsList posts={posts} session={session} />;
}
