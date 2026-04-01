import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import CategoryButton from "@/components/buttons/category-button/CategoryButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import prisma from "@/lib/db";
import { CirclePlus } from "lucide-react";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import ProfileSearchToggle from "@/components/search/ProfileSearchToggle";
import { CATEGORY_LINKS, CACHE_STRATEGY } from "@/utils/constants";
import { Suspense } from "react";
import TopCarouselSkeleton from "@/components/carousels/topCarousel/TopCarouselSkeleton";
import NewsCarouselSkeleton from "@/components/carousels/newsCarousel/NewsCarouselSkeleton";
import { withRetry } from "@/lib/prisma-retry";
import { auth } from "@/auth";
import MemberDashboard from "@/components/member-dashboard/MemberDashboard";
import {
  HealthInsurances,
  MyDoctors,
  Anamneses,
  MemberProfileDashboardProps,
  FamilyMember,
  FileWithDescription,
  TelMedicinePhoneNumber,
} from "@/utils/types";
import { getTranslations } from "next-intl/server";

type HomeNewsItem = {
  id: string;
  title: string;
  photos: string[];
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
  } | null;
};

type HomeCube = {
  id: string;
  onOff: boolean;
};

type HomeCubePostItem = {
  id: string;
  title: string;
  photos: string[];
};

type HomePageTranslator = (key: string) => string;

async function getHomePageData(isLogged: boolean, t: HomePageTranslator) {
  const cacheStrategy = isLogged ? CACHE_STRATEGY.NONE : CACHE_STRATEGY.SHORT;
  const cubeCacheStrategy = isLogged ? CACHE_STRATEGY.NONE : CACHE_STRATEGY.MEDIUM;

  try {
    const [news, cube] = await Promise.all([
      withRetry<HomeNewsItem[]>(() =>
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
          cacheStrategy,
        })
      ).catch((error) => {
        console.error(t('errorPost'), error);
        return [];
      }),
      withRetry<HomeCube | null>(() =>
        prisma.cube.findFirst({
          cacheStrategy: cubeCacheStrategy,
        })
      ).catch((error) => {
        console.error(t('errorCube'), error);
        return null;
      }),
    ]);

    const cubePosts = cube?.onOff
      ? await withRetry<HomeCubePostItem[]>(() =>
        prisma.posts.findMany({
          where: { cubeId: cube.id },
          orderBy: [
            { cubeOrder: 'asc' },
            { createdAt: 'desc' },
          ],
          select: { id: true, title: true, photos: true },
          cacheStrategy: cubeCacheStrategy,
        })
      ).catch((error) => {
        console.error(t('errorCubePosts'), error);
        return [];
      })
      : [];

    return { news, cube, cubePosts };
  } catch (error) {
    console.error(t('errorData'), error);
    return { news: [], cube: null, cubePosts: [] };
  }
}

async function getMemberByUserId(userId: string, t: HomePageTranslator) {
  try {
    const member = await prisma.memberProfile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        birthday: true,
        heightCm: true,
        weightKg: true,
        healthInsurances: true,
        phoneNumbers: true,
        bloodType: true,
        bloodTypeFiles: true,
        anamneses: true,
        documents: true,
        doctors: true,
        familyMembers: true,
        telMedicineNumbers: true,
        isActive: true,
        activeUntil: true,
      },
      cacheStrategy: CACHE_STRATEGY.NONE,
    });

    if (!member) return null;

    const safeMember: MemberProfileDashboardProps = {
      ...member,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
      phoneNumbers: Array.isArray(member.phoneNumbers) ? member.phoneNumbers : [],
      birthday: member.birthday ? member.birthday.toISOString() : null,
      activeUntil: member.activeUntil ? member.activeUntil.toISOString() : null,
      heightCm: member.heightCm ? Number(member.heightCm.toString()) : null,
      weightKg: member.weightKg ? Number(member.weightKg.toString()) : null,
      healthInsurances: Array.isArray(member.healthInsurances)
        ? (member.healthInsurances as unknown as HealthInsurances[])
        : [],
      bloodTypeFiles: Array.isArray(member.bloodTypeFiles)
        ? (member.bloodTypeFiles as unknown as FileWithDescription[])
        : [],
      doctors: Array.isArray(member.doctors)
        ? (member.doctors as unknown as MyDoctors[])
        : [],
      anamneses: Array.isArray(member.anamneses)
        ? (member.anamneses as unknown as Anamneses[])
        : [],
      documents: Array.isArray(member.documents)
        ? (member.documents as unknown as FileWithDescription[])
        : [],
      familyMembers: Array.isArray(member.familyMembers)
        ? (member.familyMembers as FamilyMember[])
        : [],
      telMedicineNumbers: Array.isArray(member.telMedicineNumbers)
        ? (member.telMedicineNumbers as unknown as TelMedicinePhoneNumber[])
        : [],
    };

    return safeMember;
  } catch (error) {
    console.error(t('errorMemberProfile'), error);
    return null;
  }
}

export default async function Home() {
  const session = await auth();
  const t = await getTranslations('HomePage');
  const tCategories = await getTranslations('Categories');

  const isLogged = !!session?.user;
  const { news, cube, cubePosts } = await getHomePageData(isLogged, t);

  let memberData: MemberProfileDashboardProps = null;
  if (session?.user?.id) {
    memberData = await getMemberByUserId(session.user.id, t);
  }


  const newsTopCarousel = news.length > 0
    ? news
      .filter((item: HomeNewsItem) => item.author && item.author.name && item.id && item.photos && item.photos[0])
      .map((item: HomeNewsItem) => ({
        id: item.id,
        name: item.title,
        profileImage: item.photos[0]
      }))
    : undefined;

  const cubeCarousel = (cubePosts || []).map((p: HomeCubePostItem) => ({
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

        {memberData && <MemberDashboard member={memberData} />}
        <MySmartHealth />
        <CategoryButton name={tCategories('theLeadingDoctors')} goTo={CATEGORY_LINKS.theLeadingDoctors.link} imageAsTitle={CATEGORY_LINKS.theLeadingDoctors.image} />
        <CategoryButton name={tCategories('mySmartHealthTermineKurzfristig')} goTo={CATEGORY_LINKS.mySmartHealthTermineKurzfristig.link} imageAsTitle={CATEGORY_LINKS.mySmartHealthTermineKurzfristig.image} />
        <ProfileSearchToggle label={tCategories('search')} />

        <CategoryButton name={tCategories('smartHealth')} icon={CATEGORY_LINKS.smartHealth.image} goTo={CATEGORY_LINKS.smartHealth.link} />
        <CategoryButton name={tCategories('medizinUndPflege')} icon={CATEGORY_LINKS.medizinUndPflege.image} goTo={CATEGORY_LINKS.medizinUndPflege.link} />
        <CategoryButton name={tCategories('notfalle')} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_LINKS.notfalle.link} />
        <TheHealthBarLink />
      </div>
    </>
  );
}
