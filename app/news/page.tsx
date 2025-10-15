import { auth } from "@/auth";
import prisma from "@/lib/db";

import PostCard from "../../components/posts/post-card/PostCard";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";

import { NewsCardType } from "@/utils/types";
import { CirclePlus } from "lucide-react";

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
      author: {
        select: {
          id: true,
          name: true,
          fieldOfExpertise: true,
        }
      }
    }
  })

  return posts;
}

export default async function NewsPage() {
  const session = await auth();

  const posts = await getData() as NewsCardType[];

  return (
    <div className="flex flex-col gap-3 w-full mb-auto max-w-[100%]">
      <div className="space-y-4 mx-auto w-full">
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" active />
      </div>
      {posts && session
        ? <PostCard posts={posts} session={session} /> :
        <PostCard posts={posts} />}
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
      <NewsSmartHealthMedizinButton name="Notfälle" icon={<CirclePlus size={34} />} goTo="/notfalle" />
    </div>
  );
}
