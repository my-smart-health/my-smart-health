'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';

type TopCarouselSkeletonProps = {
  times?: number;
};

export default function TopCarouselSkeleton({ times = 7 }: TopCarouselSkeletonProps) {
  return (
    <Swiper
      modules={[Scrollbar, Mousewheel, Autoplay]}
      spaceBetween={50}
      slidesPerView={4}
      mousewheel={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      speed={300}
      scrollbar={{ draggable: true }}
    >
      {Array.from({ length: times }).map((_, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col w-20 gap-2 pb-4">
            <div className="skeleton h-20 w-full aspect-square"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}