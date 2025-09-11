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
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";


export default function ProfilePictureCarousel({ imageSrcArray, disableOnInteraction = false }: { imageSrcArray?: string[]; disableOnInteraction?: boolean }) {

  if (!imageSrcArray || imageSrcArray.length === 0) {
    return <div className="skeleton animate-pulse h-64 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <Suspense fallback={<div className="skeleton animate-pulse h-64 bg-gray-200 rounded-lg"></div>}>
      <Swiper
        modules={[Scrollbar, Mousewheel, Autoplay, EffectCards]}
        spaceBetween={1}
        lazyPreloadPrevNext={3}
        slidesPerView={1}
        effect="cards"
        cardsEffect={{
          slideShadows: false,
        }}
        grabCursor={true}
        mousewheel={true}
        autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
        speed={300}
        scrollbar={{ draggable: true }}
        className="max-w-2xs xs:max-w-3xs md:max-w-sm mx-auto"
      >
        {imageSrcArray && imageSrcArray.map((image, idx) => {

          const WIDTH = 350;
          const HEIGHT = 350;
          if (image.search('youtu') > 0 || image.search('youtube') > 0) {
            return (
              <SwiperSlide key={idx}>
                <div className="flex flex-col justify-center items-center aspect-video rounded-box cursor-pointer max-w-full">
                  <YoutubeEmbed embedHtml={image} width={WIDTH} height={HEIGHT} />
                </div>
                <br />
              </SwiperSlide>
            )
          }
          if (image.search('instagram') > 0) {
            return (
              <SwiperSlide key={idx}>
                <div className="flex flex-col justify-center items-center rounded-box cursor-pointer max-w-full">
                  <InstagramEmbed embedHtml={image} width={WIDTH} height={HEIGHT} />
                </div>
                <br />
              </SwiperSlide>
            )
          } else {
            return (
              <SwiperSlide key={idx} className="my-4">
                <div className="rounded-box cursor-pointer">
                  <Image
                    loading="lazy"
                    placeholder="empty"
                    width={WIDTH}
                    height={HEIGHT}
                    src={image}
                    alt={image}
                    className="aspect-square"
                  />
                </div>
              </SwiperSlide>
            );
          }
        })}
      </Swiper>
    </Suspense>
  );
}
