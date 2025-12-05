import { auth } from "@/auth";
import prisma from "@/lib/db";
import { withRetry } from "@/lib/prisma-retry";

import { CACHE_STRATEGY } from "@/utils/constants";
import { NewsCardType, Social } from "@/utils/types";
import NewsList from "@/components/posts/news-list/NewsList";

async function getData() {
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
    cacheStrategy: CACHE_STRATEGY.SHORT,
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
  const posts = await getData() as NewsCardType[];

  return <NewsList posts={posts} session={session} />;
}
