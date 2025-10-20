import { auth } from "@/auth";
import prisma from "@/lib/db";

import { Suspense } from "react";

import { NewsCardType } from "@/utils/types";

import PostCard from "@/components/posts/post-card/PostCard";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import { CirclePlus } from "lucide-react";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";

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
      author: {
        select: {
          id: true,
          name: true,
          fieldOfExpertise: true,
        }
      }
    }
  });
  return post as NewsCardType | null;
}

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const post = await getData(id);

  return (
    <>
      <div className="space-y-4 mx-auto w-full">
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" active />
      </div>
      <Suspense fallback={<div className="text-center py-8">Loading post...</div>}>
        {post ? (
          <PostCard posts={[post]} session={session} />
        ) : (
          <div className="text-center text-lg text-red-500 font-semibold">
            Post not found. Try to refresh the page.
          </div>
        )}
      </Suspense>
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
      <NewsSmartHealthMedizinButton name="Notfälle" icon={<CirclePlus size={34} />} goTo="/notfalle" />
      <TheHealthBarLink />
    </>
  );
}
