import { auth } from "@/auth";
import PostCard from "@/components/posts/post-card/PostCard";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

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
      name: post.author.name ?? ""
    }
  }));

  return (
    <>
      <PostCard posts={safePosts} session={session} />
    </>
  );
}