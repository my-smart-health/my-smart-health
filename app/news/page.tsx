import GoBack from "@/components/buttons/go-back/GoBack";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import prisma from "@/lib/db";
import NewsCard from "./NewsCard";
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
  const newsData = await getData() as NewsCardType[];

  return (
    <div className="flex flex-col gap-3 w-full mb-auto max-w-[90%]">
      <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" active />
      <div className="flex justify-end">
        <GoBack />
      </div>
      {newsData && <NewsCard newsData={newsData} />}
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
    </div>
  );
}
