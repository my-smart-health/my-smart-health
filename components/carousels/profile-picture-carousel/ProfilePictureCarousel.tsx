'use client'

import Image from "next/image";
import { Suspense, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar, EffectCards, Navigation, Pagination } from "swiper/modules";

import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";
import { PAGINATION_BULLET_QUANTITY } from "@/utils/constants";


export default function ProfilePictureCarousel({ imageSrcArray }: { imageSrcArray?: string[] }) {
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

  if (!imageSrcArray || imageSrcArray.length === 0) {
    return <div className="skeleton animate-pulse h-[220px] sm:h-[280px] w-full max-w-[350px] rounded-lg"></div>;
  }

  const isSingleItem = imageSrcArray.length === 1;
  const slideHeight = 'h-[220px] sm:h-[280px]';

  return (
    <Suspense fallback={<div className="skeleton animate-pulse h-[220px] sm:h-[280px] w-full max-w-[350px] rounded-lg"></div>}>
      <Swiper
        modules={isSingleItem ? [] : [Scrollbar, Navigation, Pagination, Mousewheel, Autoplay, EffectCards]}
        spaceBetween={10}
        lazyPreloadPrevNext={1}
        slidesPerView={1}
        effect={isSingleItem ? undefined : "cards"}
        cardsEffect={isSingleItem ? undefined : {
          slideShadows: false,
          perSlideOffset: 8,
          perSlideRotate: 2,
        }}
        grabCursor={!isSingleItem}
        mousewheel={!isSingleItem}
        navigation={!isSingleItem}
        pagination={isSingleItem ? false : {
          clickable: true,
          enabled: true,
          dynamicBullets: true,
          dynamicMainBullets: PAGINATION_BULLET_QUANTITY,
        }}
        autoplay={isSingleItem ? false : { delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true, waitForTransition: true }}
        speed={400}
        className={`max-w-full mx-auto ${isSingleItem ? '' : '!pb-8'}`}
        style={{ width: '100%', maxWidth: isSingleItem ? '350px' : '450px' }}
      >
        {imageSrcArray && imageSrcArray.map((image, idx) => {

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
              <SwiperSlide key={idx} className={slideHeight}>
                <div className={`w-full ${slideHeight} rounded-lg overflow-hidden bg-black`}>
                  <YoutubeEmbed embedHtml={image} width="100%" height="100%" />
                </div>
              </SwiperSlide>
            )
          }
          if (isValidInstagramUrl(image)) {
            return (
              <SwiperSlide key={idx} className={slideHeight}>
                <div className={`w-full ${slideHeight} rounded-lg overflow-hidden`}>
                  <InstagramEmbed embedHtml={image} width="100%" height="100%" />
                </div>
              </SwiperSlide>
            )
          } else if (isValidImageUrl(image)) {
            return (
              <SwiperSlide key={idx} className={slideHeight}>
                <div className={`flex justify-center items-center w-full ${slideHeight} rounded-lg`}>
                  <Image
                    placeholder="empty"
                    width={350}
                    height={280}
                    src={image}
                    alt={image}
                    className="w-auto h-full max-h-[220px] sm:max-h-[280px] object-contain rounded-lg cursor-zoom-in"
                    onClick={e => {
                      e.preventDefault();
                      setZoomedIdx(idx);
                    }}
                  />
                </div>
              </SwiperSlide>
            );
          }
          return (
            <SwiperSlide key={idx} className={slideHeight}>
              <div className={`flex justify-center items-center w-full ${slideHeight}`}>
                <div className="skeleton animate-pulse h-40 sm:h-64 w-40 sm:w-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Invalid URL</span>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

      </Swiper>
      {zoomedIdx !== null && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center transition-opacity cursor-zoom-out"
          onClick={() => setZoomedIdx(null)}
        >
          <div
            className="relative max-w-3xl w-full flex justify-center items-center cursor-zoom-out"
            onClick={e => { e.stopPropagation(); setZoomedIdx(null); }}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold cursor-pointer"
              onClick={() => setZoomedIdx(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="relative w-full h-[60vh] md:h-[80vh]">
              <Image
                placeholder="empty"
                src={imageSrcArray[zoomedIdx!]}
                alt={`Zoomed photo ${zoomedIdx! + 1}`}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
