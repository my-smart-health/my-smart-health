'use client'
import { Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";

import Image from "next/image";
import Link from "next/link";
import { ProfileNewsCarouselItem } from "@/utils/types";
import { PAGINATION_BULLET_QUANTITY } from "@/utils/constants";

type ProfileNewsCarouselItemProps = {
  carouselItems: ProfileNewsCarouselItem[];
  disableOnInteraction?: boolean;
};

export default function ProfileNewsCarousel({ carouselItems, disableOnInteraction = false }: ProfileNewsCarouselItemProps) {

  if (!carouselItems || carouselItems.length === 0) {
    return <div>No profiles found</div>;
  }

  const isBulletsNeeded = carouselItems.length > 4;

  return (
    <Suspense fallback={<div className="text-center w-full">Loading...</div>}>
      <div draggable={false}>
        <Swiper
          modules={[Pagination, Mousewheel, Autoplay]}
          spaceBetween={4}
          slidesPerView={4}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}
          pagination={{ clickable: true, enabled: true, dynamicBullets: true, dynamicMainBullets: PAGINATION_BULLET_QUANTITY }}
        >
          {carouselItems.map((item, index) => (
            <SwiperSlide
              key={item.id}
              className={`cursor-pointer ${isBulletsNeeded ? 'pb-5' : ''}`}>
              <div
                className="relative"
              >
                <Link href={`/news/${item.id}`} className="link hover:text-primary">
                  <Image
                    priority={index < 4}
                    loading={index < 4 ? "eager" : "lazy"}
                    placeholder="empty"
                    width={300}
                    height={300}
                    alt={item.title}
                    src={item.photos && item.photos.length > 0 ? item.photos[0] : ''}
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
                    style={{ objectFit: "contain", width: "auto", height: "auto" }}
                    className="rounded-box border-3 border-primary aspect-square"
                  />
                  <span className="text-center space-x-0.5 line-clamp-1 break-all max-w-[80%] mx-auto text-lg mb-4">{item.title}</span>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense >
  );
}
