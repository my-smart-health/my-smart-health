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
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">
      <PostCard posts={safePosts} session={session} />
    </main>
  );
}