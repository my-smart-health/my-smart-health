'use client'

import Image from "next/image";
import { Suspense } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar, EffectCards } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cards';


export default function ProfilePictureCarousel({ imageSrcArray, disableOnInteraction = false }: { imageSrcArray?: string[]; disableOnInteraction?: boolean }) {

  if (!imageSrcArray || imageSrcArray.length === 0) {
    return <div className="skeleton animate-pulse h-64 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <Suspense fallback={<div className="skeleton animate-pulse h-64 bg-gray-200 rounded-lg"></div>}>
      <Swiper
        modules={[Scrollbar, Mousewheel, Autoplay, EffectCards]}
        spaceBetween={1}
        slidesPerView={1}

        speed={300}

        autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
        mousewheel={true}
        scrollbar={{ draggable: true }}
        effect="cards"
        className="max-w-2xs xs:max-w-3xs md:max-w-sm mx-auto"
      >
        {imageSrcArray && imageSrcArray.map((image, idx) => (
          <SwiperSlide key={idx} className="my-4">
            <div className="rounded-box cursor-pointer">
              <Image
                loading="lazy"
                placeholder="empty"
                width={350}
                height={350}
                src={image}
                alt="Health Bar"
                className="aspect-square"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Suspense>
  );
}
