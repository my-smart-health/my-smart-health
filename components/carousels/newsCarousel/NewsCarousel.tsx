'use client'
import { Suspense } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCube, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cube';
import NewsCarouselSkeleton from "./NewsCarouselSkeleton";

type NewsCarouselProps = {
  props?: {
    id: string;
    imageSrc: string;
    info: string;
  }[]
};

export default function NewsCarousel({ props }: NewsCarouselProps) {

  if (!props || props.length === 0) {
    return <NewsCarouselSkeleton />;
  }

  return (
    <Suspense fallback={<NewsCarouselSkeleton />}>
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
          {props.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex flex-col justify-center items-center rounded-box cursor-pointer">
                <Image
                  loading="lazy"
                  placeholder="empty"
                  width={400}
                  height={400}
                  src={item.imageSrc}
                  alt={item.info}
                  className="aspect-square"
                />
                <span className="text-center text-white text-3xl w-full bg-[#2db9bc]">
                  {item.info}
                </span>
              </div>
              <br />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
