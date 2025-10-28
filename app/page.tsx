import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import prisma from "@/lib/db";
import { Circle } from "lucide-react";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";

async function getNews() {
  const news = await prisma.posts.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      photos: true,
      createdAt: true,
      author: true,
    }
  });
  return { news };
}

export default async function Home() {

  const { news } = await getNews();

  const newsTopCarousel = news.length > 0
    ? news
      .filter(item => item.author && item.author.name && item.id && item.photos && item.photos[0])
      .map(item => ({
        id: item.id,
        name: item.author.name as string,
        profileImage: item.photos[0]
      }))
    : undefined;

  const safeNews = news.length > 0 ? news.map(item => ({
    id: item.id,
    info: item.title,
    image: item.photos && item.photos.length > 0 ? item.photos[0] : '',
  })) : null;

  return (
    <>
      <div className="w-full">
        <TopCarousel props={newsTopCarousel} />
      </div>
      <div className="w-full">
        {safeNews && <NewsCarousel props={safeNews} />}
      </div>
      <div className="flex flex-col mt-3 gap-3 w-full mx-auto max-w-[100%]">
        <MySmartHealth />
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
        <NewsSmartHealthMedizinButton name="Meine Gesundheit" icon="/icon3.png" goTo="/smart-health" />
        <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
        <NewsSmartHealthMedizinButton name="Notfälle" icon={<Circle size={34} color="red" />} goTo="/notfalle" />
        <TheHealthBarLink />
      </div>
    </>
  );
}
