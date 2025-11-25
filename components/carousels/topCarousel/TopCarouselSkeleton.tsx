'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { PAGINATION_BULLET_QUANTITY } from "@/utils/constants";

type TopCarouselSkeletonProps = {
  times?: number;
};

export default function TopCarouselSkeleton({ times = 7 }: TopCarouselSkeletonProps) {
  return (
    <div className="min-h-36 max-h-fit max-w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={4}
        slidesPerView={4}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true, waitForTransition: true }}
        speed={300}
        pagination={{ clickable: true, enabled: true, dynamicBullets: true, dynamicMainBullets: PAGINATION_BULLET_QUANTITY }}
      >
        {Array.from({ length: times }).map((_, index) => (
          <SwiperSlide key={index} className="cursor-pointer pb-6">
            <div className="block">
              <div className="skeleton aspect-square w-full rounded-box" style={{ maxWidth: '200px', width: '100%', height: 'auto' }}></div>
              <p className="skeleton text-center break-words line-clamp-1 text-[#2c2e35] mb-4 mt-2">&nbsp;</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}