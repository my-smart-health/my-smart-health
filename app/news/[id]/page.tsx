import { auth } from "@/auth";
import prisma from "@/lib/db";

import { Suspense } from "react";

import { CACHE_STRATEGY } from "@/utils/constants";
import { NewsCardType, Social } from "@/utils/types";
import PostCard from "@/components/posts/post-card/PostCard";

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

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const post = await getData(id);

  return (
    <Suspense fallback={<div className="text-center py-8">Loading post...</div>}>
      {post ? (
        <PostCard posts={[post]} session={session} />
      ) : (
        <div className="text-center text-lg text-red-500 font-semibold">
          Post not found. Try to refresh the page.
        </div>
      )}
    </Suspense>
  );
}
