import { auth } from "@/auth";
import prisma from "@/lib/db";

import { Suspense } from "react";

import { NewsCardType, Social } from "@/utils/types";

import PostCard from "@/components/posts/post-card/PostCard";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import { Circle } from "lucide-react";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";

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
    }
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
    <>
      <MySmartHealth />
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
      <NewsSmartHealthMedizinButton name="Meine Gesundheit" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
      <NewsSmartHealthMedizinButton name="Notfälle" icon={<Circle size={34} color="red" />} goTo="/notfalle" />
      <TheHealthBarLink />
    </>
  );
}
