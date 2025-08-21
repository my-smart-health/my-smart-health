'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCube, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cube';

type NewsCarouselSkeletonProps = {
  times?: number;
};

export default function NewsCarouselSkeleton({ times = 7 }: NewsCarouselSkeletonProps) {

  return (
    <div className="mx-auto max-w-2xs md:max-w-sm">
      <Swiper
        modules={[Scrollbar, Mousewheel, Autoplay, EffectCube]}
        spaceBetween={0}
        slidesPerView={1}
        effect="cube"
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }}
        mousewheel={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={300}
        scrollbar={{ draggable: true }}
      >
        {Array.from({ length: times }).map((_, index) => (
          <SwiperSlide key={index}>
            <div className="skeleton h-[100%] aspect-square"></div>
            <br />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
