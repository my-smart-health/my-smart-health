import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import prisma from "@/lib/db";
import { CirclePlus } from "lucide-react";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import ProfileSearchToggle from "@/components/search/ProfileSearchToggle";
import { CATEGORY_NAMES, CACHE_STRATEGY } from "@/utils/constants";

export const revalidate = 0;

async function getHomePageData() {
  const [news, cube] = await Promise.all([
    prisma.posts.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        photos: true,
        createdAt: true,
        author: true,
      },
      cacheStrategy: CACHE_STRATEGY.SHORT,
    }),
    prisma.cube.findFirst({
      cacheStrategy: CACHE_STRATEGY.LONG,
    }),
  ]);

  const cubePosts = cube?.onOff
    ? await prisma.posts.findMany({
      where: { cubeId: cube.id },
      orderBy: [
        { cubeOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      select: { id: true, title: true, photos: true },
      cacheStrategy: CACHE_STRATEGY.MEDIUM,
    })
    : [];

  return { news, cube, cubePosts };
}

export default async function Home() {
  const { news, cube, cubePosts } = await getHomePageData();


  const newsTopCarousel = news.length > 0
    ? news
      .filter(item => item.author && item.author.name && item.id && item.photos && item.photos[0])
      .map(item => ({
        id: item.id,
        name: item.title,
        profileImage: item.photos[0]
      }))
    : undefined;

  const cubeCarousel = (cubePosts || []).map(p => ({
    id: p.id,
    info: p.title,
    image: p.photos && p.photos.length > 0 ? p.photos[0] : '',
  }));

  return (
    <>
      <div className="w-full">
        <TopCarousel props={newsTopCarousel} />
      </div>
      {cube && cube.onOff && cubeCarousel.length > 0 && (
        <div className="w-full mt-3">
          <NewsCarousel props={cubeCarousel} />
        </div>
      )}

      <div className="flex flex-col mt-3 gap-3 w-full mx-auto max-w-[100%]">
        <MySmartHealth />
        <ProfileSearchToggle />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.news.name} icon="/icon2.png" goTo={CATEGORY_NAMES.news.link} />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo={CATEGORY_NAMES.medizinUndPflege.link} />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_NAMES.notfalle.link} />
        <TheHealthBarLink />
      </div>
    </>
  );
}
