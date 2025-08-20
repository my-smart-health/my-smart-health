'use client'
import { Suspense } from "react";
import TopCarouselSkeleton from "./TopCarouselSkeleton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';

type CarouselItemProps = {
  props?: {
    id: string;
    imageSrc: string;
    name: string;
  }[]
};

export default function TopCarousel({ props }: CarouselItemProps) {

  if (!props || props.length === 0) {
    return (
      <div className="flex flex-row bg-white rounded-box space-x-4 p-4 max-w-[calc(85vw)] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[36vw]">
        <TopCarouselSkeleton times={7} />
      </div >

    );
  }

  return (
    <Suspense fallback={<TopCarouselSkeleton times={7} />}>
      <div>
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
                <img
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
