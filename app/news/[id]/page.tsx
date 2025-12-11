import { auth } from "@/auth";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { withRetry } from "@/lib/prisma-retry";

import { CACHE_STRATEGY } from "@/utils/constants";
import { NewsCardType, Social } from "@/utils/types";
import NewsList from "@/components/posts/news-list/NewsList";

async function getData(id: string, isLogged: boolean): Promise<NewsCardType | null> {
  const cacheStrategy = isLogged ? CACHE_STRATEGY.NONE : CACHE_STRATEGY.MEDIUM;

  const post = await withRetry(() => prisma.posts.findUnique({
    where: { id },
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
    console.error('Error fetching news post:', error);
    return null;
  });

  if (!post) return null;

  return {
    ...post,
    socialLinks: Array.isArray(post.socialLinks) ? (post.socialLinks as unknown as Social[]) : []
  } as NewsCardType;
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const isLogged = !!session?.user;
  const { id } = await params;
  const post = await getData(id, isLogged);

  if (!post) {
    notFound();
  }

  return <NewsList posts={[post]} session={session} />;
}
