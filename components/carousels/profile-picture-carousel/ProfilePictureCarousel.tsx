'use client'

import Image from "next/image";
import { Suspense } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar, EffectCards, Navigation, Pagination } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cards';
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";


export default function ProfilePictureCarousel({ imageSrcArray }: { imageSrcArray?: string[] }) {

  if (!imageSrcArray || imageSrcArray.length === 0) {
    return <div className="skeleton animate-pulse h-64 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <Suspense fallback={<div className="skeleton animate-pulse h-64 bg-gray-200 rounded-lg"></div>}>
      <Swiper
        modules={[Scrollbar, Navigation, Pagination, Mousewheel, Autoplay, EffectCards]}
        spaceBetween={1}
        lazyPreloadPrevNext={3}
        slidesPerView={1}
        effect="cards"
        cardsEffect={{
          slideShadows: false,
        }}
        grabCursor={true}
        mousewheel={true}
        navigation={true}
        pagination={{ clickable: true, enabled: true }}
        autoplay={{ delay: 3000, disableOnInteraction: true, pauseOnMouseEnter: true, waitForTransition: true }}
        speed={300}
        className="max-w-2xs xs:max-w-3xs md:max-w-sm mx-auto"
      >
        {imageSrcArray && imageSrcArray.map((image, idx) => {

          const WIDTH = 350;
          const HEIGHT = 350;

          const isValidImageUrl = (url: string) => {
            return /\.(jpeg|jpg|gif|png|bmp|webp|svg)$/.test(url);
          }
          const isValidYoutubeUrl = (url: string) => {
            return /youtu(be)?/.test(url);
          }

          const isValidInstagramUrl = (url: string) => {
            return /instagram/.test(url);
          }
          if (isValidYoutubeUrl(image)) {
            return (
              <SwiperSlide key={idx}>
                <div className={`flex flex-col justify-center items-center aspect-video rounded-box cursor-pointer max-w-[calc(${HEIGHT}px * 0.65)] md:max-w-full`}>
                  <YoutubeEmbed embedHtml={image} width={WIDTH} height={HEIGHT * 0.65} />
                </div>
                <br />
              </SwiperSlide>
            )
          }
          if (isValidInstagramUrl(image)) {
            return (
              <SwiperSlide key={idx}>
                <div className={`flex flex-col justify-center items-center rounded-box cursor-pointer max-w-[calc(${HEIGHT}px * 0.65)] md:max-w-full`}>
                  <InstagramEmbed embedHtml={image} width={WIDTH} height={HEIGHT * 0.65} />
                </div>
                <br />
              </SwiperSlide>
            )
          } else if (isValidImageUrl(image)) {
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
                    className="aspect-square w-auto h-auto object-scale-down rounded-lg"
                  />
                </div>
                <br />
              </SwiperSlide>
            );
          }
          return (
            <SwiperSlide key={idx}>
              <div className="flex flex-col justify-center items-center rounded-box cursor-pointer max-w-full">
                <div className="skeleton animate-pulse h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Invalid image URL</span>
                </div>
              </div>
              <br />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Suspense>
  );
}
