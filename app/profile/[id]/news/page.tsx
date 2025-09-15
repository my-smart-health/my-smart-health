import NewsCardDetails from "@/app/news/NewsCardDetails";
import { auth } from "@/auth";
import prisma from "@/lib/db";

async function getAllPostsByUserId(userId: string) {
  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  return posts;
}

async function getAuthorNameById(authorId: string) {
  const author = await prisma.user.findUnique({
    where: { id: authorId },
    select: {
      name: true,
    }
  });
  return author?.name || "Unknown Author";
}

export default async function ProfileNewsPage({ params }: { params: Promise<{ id: string }> }) {

  const session = await auth();

  const profileId = (await params).id;

  const posts = await getAllPostsByUserId(profileId);
  const authorName = await getAuthorNameById(profileId);

  if (posts) {
    return (
      <main className="flex flex-col gap-3 w-full mb-auto max-w-[100%]">
        <h1 className="flex flex-wrap mx-auto text-xl font-bold text-primary text-center">{authorName} News</h1>

        {posts.length > 0 && session && (
          posts.map((post: any) => (
            <NewsCardDetails key={post.id} newsData={post} session={session} />
          ))
        )}

        {posts.length > 0 && !session && (
          posts.map((post: any) => (
            <NewsCardDetails key={post.id} newsData={post} />
          ))
        )}

        {posts && posts.length === 0 && (
          <p className="text-center">No news articles found for this user.</p>
        )}

      </main>
    );
  }

  return <div>Error fetching news articles</div>;
}
