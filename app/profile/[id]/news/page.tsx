import prisma from "@/lib/db";
import { auth } from "@/auth";

import { NewsCardType, Social } from "@/utils/types";

import PostCard from "@/components/posts/post-card/PostCard";

import { CACHE_STRATEGY } from "@/utils/constants";

async function getAllPostsByUserId(userId: string, isOwnProfile: boolean, isAdmin: boolean) {
  const cacheStrategy = (isOwnProfile || isAdmin) ? CACHE_STRATEGY.NONE : CACHE_STRATEGY.SHORT;

  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
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
  });

  return posts.map((post) => ({
    ...post,
    socialLinks: Array.isArray(post.socialLinks) ? (post.socialLinks as unknown as Social[]) : []
  })) as NewsCardType[];
}

async function getAuthorNameById(authorId: string) {
  const author = await prisma.user.findUnique({
    where: { id: authorId },
    select: {
      name: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });
  return author?.name || "Unknown Author";
}

export default async function ProfileNewsPage({ params }: { params: Promise<{ id: string }> }) {

  const session = await auth();

  const profileId = (await params).id;

  const isOwnProfile = session?.user?.id === profileId;
  const isAdmin = session?.user?.role === 'ADMIN';

  const posts = await getAllPostsByUserId(profileId, isOwnProfile, isAdmin);
  const authorName = await getAuthorNameById(profileId);

  if (posts) {
    return (
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="flex flex-wrap mx-auto text-xl font-bold text-primary text-center">{authorName} News</h1>
        <PostCard posts={posts} session={session} />
      </div>
    );

  }

  return <div>Error fetching news articles</div>;
}
