import { auth } from "@/auth";
import prisma from "@/lib/db";

import { Suspense } from "react";

import { NewsCardType, Social } from "@/utils/types";

import PostCard from "@/components/posts/post-card/PostCard";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import { CirclePlus } from "lucide-react";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import { CATEGORY_NAMES } from "@/utils/constants";

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
    cacheStrategy: { ttl: 120, swr: 60 },
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
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.news.name} icon="/icon2.png" goTo={CATEGORY_NAMES.news.link} active />
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
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo={CATEGORY_NAMES.medizinUndPflege.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_NAMES.notfalle.link} />
      <TheHealthBarLink />
    </>
  );
}
