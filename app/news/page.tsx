import { auth } from "@/auth";
import prisma from "@/lib/db";

import NewsCard from "./NewsCard";
import GoBack from "@/components/buttons/go-back/GoBack";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";

import { NewsCardType } from "@/utils/types";

async function getData() {
  const prismaResult = await prisma.posts.findMany({
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
      author: {
        select: {
          id: true,
          name: true,
          fieldOfExpertise: true,
        }
      }
    }
  })

  return prismaResult;
}

export default async function NewsPage() {
  const session = await auth();

  const newsData = await getData() as NewsCardType[];

  return (
    <div className="flex flex-col gap-3 w-full mb-auto max-w-[100%]">
      <div className="space-y-4 mx-auto w-full">
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" active />
        <div className="flex justify-end my-2">
          <GoBack />
        </div>
      </div>
      {newsData && session
        ? <NewsCard newsData={newsData} session={session} /> :
        <NewsCard newsData={newsData} />}
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
    </div>
  );
}
