'use client';

import { ProfileNewsCarouselItem } from "@/utils/types";
import { useTranslations } from "next-intl";

import ProfileNewsCarousel from "@/components/carousels/profile-news/ProfileNewsCarousel";

export default function NewsSection({ posts }: { posts: ProfileNewsCarouselItem[] }) {
  const t = useTranslations("ProfileFull");
  if (!posts?.length) return null;

  return (
    <section className="w-full">
      <h2 className="font-bold text-primary text-xl mb-2">{t("newsTitle")}</h2>
      <div className="w-full h-fit border border-primary rounded-lg p-2 shadow-sm">
        <ProfileNewsCarousel carouselItems={posts} />
      </div>
    </section>
  );
}