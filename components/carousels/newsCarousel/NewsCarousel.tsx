'use client'
import { Suspense } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';

type NewsCarouselProps = {
  props?: {
    id: string;
    imageSrc: string;
    info: string;
  }[]
};

export default function NewsCarousel({ props }: NewsCarouselProps) {

  if (!props || props.length === 0) {
    return (
      <div className="flex flex-row bg-white rounded-box space-x-4 p-4 max-w-[calc(85vw)] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[36vw]">
      </div >

    );
  }

  return (
    <Suspense fallback={<></>}>
      <div>
        <Swiper
          modules={[Scrollbar, Mousewheel, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={300}
          scrollbar={{ draggable: true }}
        >
          {props.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex flex-col h-full pb-4 rounded-box">
                <img
                  src={item.imageSrc}
                  className=" aspect-square"
                />
                <span className="bg-[#2db9bc] text-center text-white text-3xl">{item.info}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
