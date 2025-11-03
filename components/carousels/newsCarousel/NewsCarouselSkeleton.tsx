'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCube, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { PAGINATION_BULLET_QUANTITY } from "@/utils/constants";

type NewsCarouselSkeletonProps = {
  times?: number;
};

export default function NewsCarouselSkeleton({ times = 7 }: NewsCarouselSkeletonProps) {

  return (
    <div className="mx-auto max-w-2xs md:max-w-sm">
      <Swiper
        modules={[Scrollbar, Navigation, Pagination, Mousewheel, Autoplay, EffectCube]}
        spaceBetween={0}
        slidesPerView={1}
        effect="cube"
        grabCursor={true}
        navigation={true}
        pagination={{ clickable: true, enabled: true, dynamicBullets: true, dynamicMainBullets: PAGINATION_BULLET_QUANTITY }}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }}

        mousewheel={true}
        autoplay={{ delay: 3000, disableOnInteraction: true, pauseOnMouseEnter: true, waitForTransition: true }}
        speed={300}
      >
        {Array.from({ length: times }).map((_, index) => (
          <SwiperSlide key={index}>
            <div className="skeleton min-h-fit min-w-fit aspect-square"></div>
            <br />
            <br />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
