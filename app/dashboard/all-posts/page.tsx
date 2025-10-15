import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FieldOfExpertise } from '@/utils/types';

import PostCard from "@/components/posts/post-card/PostCard";

async function getAllPosts(userId: string) {
  const allPosts = await prisma.posts.findMany({
    where: {
      authorId: userId
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          fieldOfExpertise: true
        }
      }
    }
  });
  return allPosts;
}

export default async function AllPostsPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const allPosts = await getAllPosts(session.user.id);

  const safePosts = allPosts.map(post => ({
    ...post,
    author: {
      ...post.author,
      name: post.author.name ?? "",
      fieldOfExpertise: Array.isArray(post.author.fieldOfExpertise) ? (post.author.fieldOfExpertise as unknown as FieldOfExpertise[]) : []
    }
  }));

  return (
    <>
      <PostCard posts={safePosts} session={session} />
    </>
  );
}