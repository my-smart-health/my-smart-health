'use client'
import { Suspense } from "react";
import TopCarouselSkeleton from "./TopCarouselSkeleton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import Image from "next/image";

type TopCarouselItemProps = {
  props?: {
    id: string;
    imageSrc: string;
    name: string;
  }[]
};

export default function TopCarousel({ props }: TopCarouselItemProps) {

  if (!props || props.length === 0) {
    return <TopCarouselSkeleton times={7} />;
  }

  return (
    <Suspense fallback={<TopCarouselSkeleton times={7} />}>
      <div className="mx-auto max-w-2xs md:max-w-sm">
        <Swiper
          modules={[Scrollbar, Mousewheel, Autoplay]}
          spaceBetween={50}
          slidesPerView={4}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={300}
          scrollbar={{ draggable: true }}
        >
          {props.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex flex-col w-20 gap-1 pb-4">
                <Image
                  loading="lazy"
                  width={400}
                  height={400}
                  alt={item.name}
                  src={item.imageSrc}
                  className="rounded-box border-6 border-[#2db9bc] aspect-square"
                />
                <p className="text-center">{item.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
