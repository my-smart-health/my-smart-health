'use client'
import { Suspense } from "react";
import TopCarouselSkeleton from "./TopCarouselSkeleton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";

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
          modules={[Pagination, Mousewheel, Autoplay]}
          spaceBetween={4}
          slidesPerView={4}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}

          pagination={{ clickable: true, enabled: true, dynamicBullets: true, dynamicMainBullets: PAGINATION_BULLET_QUANTITY }}
        >
          {props.map((news, index) => (
            <SwiperSlide
              key={news.id}
              className="cursor-pointer pb-6">
              <Link href={`/news/${news.id}`}>
                <Image
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                  placeholder="empty"
                  width={400}
                  height={400}
                  alt={news.name}
                  src={news.profileImage}
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
                  style={{ objectFit: 'contain' }}
                  className="rounded-box border-6 border-primary aspect-square"
                />
                <p className="text-center break-words line-clamp-1 text-[#2c2e35] mb-4">{news.name}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
