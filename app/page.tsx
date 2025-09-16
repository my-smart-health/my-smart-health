import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/the-health-bar-link/TheHealthBarLink";
import prisma from "@/lib/db";


async function getNews() {
  const news = await prisma.posts.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      photos: true,
      createdAt: true,
    }
  });
  return { news };
}

export default async function Home() {

  const { news } = await getNews();

  const newsTopCarousel = news.length > 0
    ? news.map(item => ({ id: item.id, name: item.title, profileImage: item.photos[0] }))
    : undefined;

  const safeNews = news.length > 0 ? news.map(item => ({
    id: item.id,
    info: item.title,
    image: item.photos && item.photos.length > 0 ? item.photos[0] : '',
  })) : null;

  return (
    <main className="flex flex-col items-center gap-4 max-w-[100%] min-h-[100dvh] mb-auto justify-items-center">
      <span className="w-full border">
        <TopCarousel props={newsTopCarousel} />
      </span>
      {safeNews && <NewsCarousel props={safeNews} />}
      <div className="flex flex-col gap-3 w-full mx-auto max-w-[100%]">
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
        <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
        <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
        <TheHealthBarLink />
      </div>
    </main>
  );
}
