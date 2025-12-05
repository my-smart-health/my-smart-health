import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import prisma from "@/lib/db";
import { CirclePlus } from "lucide-react";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import ProfileSearchToggle from "@/components/search/ProfileSearchToggle";
import { CATEGORY_NAMES, CACHE_STRATEGY } from "@/utils/constants";
import { Suspense } from "react";
import TopCarouselSkeleton from "@/components/carousels/topCarousel/TopCarouselSkeleton";
import NewsCarouselSkeleton from "@/components/carousels/newsCarousel/NewsCarouselSkeleton";
import { withRetry } from "@/lib/prisma-retry";

async function getHomePageData() {
  try {
    const [news, cube] = await Promise.all([
      withRetry(() =>
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
        })
      ).catch((error) => {
        console.error('Error fetching news posts:', error);
        return [];
      }),
      withRetry(() =>
        prisma.cube.findFirst({
          cacheStrategy: CACHE_STRATEGY.MEDIUM,
        })
      ).catch((error) => {
        console.error('Error fetching cube:', error);
        return null;
      }),
    ]);

    const cubePosts = cube?.onOff
      ? await withRetry(() =>
        prisma.posts.findMany({
          where: { cubeId: cube.id },
          orderBy: [
            { cubeOrder: 'asc' },
            { createdAt: 'desc' },
          ],
          select: { id: true, title: true, photos: true },
          cacheStrategy: CACHE_STRATEGY.MEDIUM,
        })
      ).catch((error) => {
        console.error('Error fetching cube posts:', error);
        return [];
      })
      : [];

    return { news, cube, cubePosts };
  } catch (error) {
    console.error('Critical error in getHomePageData:', error);
    return { news: [], cube: null, cubePosts: [] };
  }
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
      {newsTopCarousel && newsTopCarousel.length > 0 && (
        <div className="w-full">
          <Suspense fallback={<TopCarouselSkeleton times={7} />}>
            <TopCarousel props={newsTopCarousel} />
          </Suspense>
        </div>
      )}
      {cube && cube.onOff && cubeCarousel.length > 0 && (
        <div className="w-full mt-3">
          <Suspense fallback={<NewsCarouselSkeleton />}>
            <NewsCarousel props={cubeCarousel} />
          </Suspense>
        </div>
      )}

      <div className="flex flex-col mt-3 gap-3 w-full mx-auto max-w-[100%]">
        <MySmartHealth />
        <ProfileSearchToggle />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.news.name} icon="/icon2.png" goTo={CATEGORY_NAMES.news.link} />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.theLeadingDoctors.name} goTo={CATEGORY_NAMES.theLeadingDoctors.link} imageAsTitle="/the-leading-doctors.png" />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo={CATEGORY_NAMES.medizinUndPflege.link} />
        <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_NAMES.notfalle.link} />
        <TheHealthBarLink />
      </div>
    </>
  );
}
