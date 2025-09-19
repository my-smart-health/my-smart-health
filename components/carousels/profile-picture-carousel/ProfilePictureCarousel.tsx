'use client'

import Image from "next/image";
import { Suspense, useState } from "react";

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
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

  if (!imageSrcArray || imageSrcArray.length === 0) {
    return <div className="skeleton animate-pulse h-[350px] w-[350px] bg-gray-200 rounded-lg"></div>;
  }

  return (
    <Suspense fallback={<div className="skeleton animate-pulse h-[350px] w-[350px] bg-gray-200 rounded-lg"></div>}>
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
        className="max-w-full mx-auto"
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
              <SwiperSlide key={idx}>
                <div className={`flex flex-col justify-center items-center aspect-video rounded-box cursor-pointer max-w-full md:max-w-full`}>
                  <YoutubeEmbed embedHtml={image} width={"100%"} height={"100%"} />
                </div>
                <br />
              </SwiperSlide>
            )
          }
          if (isValidInstagramUrl(image)) {
            return (
              <SwiperSlide key={idx}>
                <div className={`flex flex-col justify-center items-center rounded-box cursor-pointer max-w-full md:max-w-full`}>
                  <InstagramEmbed embedHtml={image} width={"100%"} height={"280px"} />
                </div>
                <br />
              </SwiperSlide>
            )
          } else if (isValidImageUrl(image)) {
            return (
              <SwiperSlide key={idx} className="my-4">
                <div className="relative rounded-box cursor-zoom-in">
                  <Image
                    priority
                    loading="eager"
                    placeholder="empty"
                    width={350}
                    height={350}
                    src={image}
                    alt={image}
                    style={{ objectFit: "contain", width: "420px", height: "300px" }}
                    className="aspect-square rounded-lg"
                    onClick={e => {
                      e.preventDefault();
                      setZoomedIdx(idx);
                    }}
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
      {zoomedIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity cursor-zoom-out"
          onClick={() => setZoomedIdx(null)}
        >
          <div
            className="relative max-w-3xl w-full flex justify-center items-center cursor-zoom-out"
            onClick={e => { e.stopPropagation(); setZoomedIdx(null); }}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10 cursor-pointer"
              onClick={() => setZoomedIdx(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="relative w-full h-[60vh] md:h-[80vh]">
              <Image
                loading="eager"
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
