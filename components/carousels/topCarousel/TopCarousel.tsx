'use client'
import { Suspense } from "react";
import TopCarouselSkeleton from "./TopCarouselSkeleton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import Image from "next/image";
import Link from "next/link";
import { PAGINATION_BULLET_QUANTITY } from "@/utils/constants";

type TopCarouselItemProps = {
  props?: {
    id: string;
    name: string;
    profileImage: string;
  }[];
  disableOnInteraction?: boolean;
};

export default function TopCarousel({ props, disableOnInteraction = false }: TopCarouselItemProps) {

  if (!props || props.length === 0) {
    return <TopCarouselSkeleton times={7} />;
  }

  return (
    <Suspense fallback={<TopCarouselSkeleton times={7} />}>
      <div draggable={false} className="min-h-36 max-h-fit max-w-full">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={4}
          slidesPerView={4}
          autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}

          pagination={{ clickable: true, enabled: true, dynamicBullets: true, dynamicMainBullets: PAGINATION_BULLET_QUANTITY }}
        >
          {props.map((news, index) => (
            <SwiperSlide
              key={news.id}
              className="cursor-pointer pb-6">
              <Link href={`/news/${news.id}`} className="block" prefetch={false}>
                <Image
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  placeholder="empty"
                  width={182}
                  height={182}
                  alt={news.name}
                  src={news.profileImage}
                  sizes="25vw"
                  style={{ objectFit: 'contain', maxWidth: '182px', width: '100%', height: 'auto' }}
                  className="rounded-box border-6 border-primary aspect-square w-full h-auto"
                />
                <p className="text-center break-words line-clamp-1 text-[#2c2e35] mb-4 mt-2">{news.name}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
