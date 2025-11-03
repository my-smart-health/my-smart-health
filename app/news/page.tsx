import { auth } from "@/auth";
import prisma from "@/lib/db";

import PostCard from "../../components/posts/post-card/PostCard";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";

import { NewsCardType, Social } from "@/utils/types";
import { CirclePlus } from "lucide-react";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import { CATEGORY_NAMES } from "@/utils/constants";

async function getData() {
  const posts = await prisma.posts.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
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
  })

  return posts.map(post => ({
    ...post,
    socialLinks: Array.isArray(post.socialLinks) ? (post.socialLinks as unknown as Social[]) : []
  }));
}

export default async function NewsPage() {
  const session = await auth();

  const posts = await getData() as NewsCardType[];

  return (
    <div className="flex flex-col gap-3 w-full mb-auto max-w-[100%]">
      <MySmartHealth />
      <div className="space-y-4 mx-auto w-full">
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.news.name} icon="/icon2.png" goTo="/" active />
      </div>
      {posts && session
        ? <PostCard posts={posts} session={session} /> :
        <PostCard posts={posts} />}
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo={CATEGORY_NAMES.medizinUndPflege.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_NAMES.notfalle.link} />
      <TheHealthBarLink />
    </div>
  );
}
