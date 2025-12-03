import { auth } from "@/auth";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

import { CACHE_STRATEGY } from "@/utils/constants";
import { NewsCardType, Social } from "@/utils/types";
import NewsList from "@/components/posts/news-list/NewsList";

export const revalidate = 0;

async function getData(id: string): Promise<NewsCardType | null> {
  const post = await prisma.posts.findUnique({
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
    cacheStrategy: CACHE_STRATEGY.MEDIUM,
  });

  if (!post) return null;

  return {
    ...post,
    socialLinks: Array.isArray(post.socialLinks) ? (post.socialLinks as unknown as Social[]) : []
  } as NewsCardType;
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const post = await getData(id);

  if (!post) {
    notFound();
  }

  return <NewsList posts={[post]} session={session} />;
}
