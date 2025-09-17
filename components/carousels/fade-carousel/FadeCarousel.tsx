'use client'

import Image from "next/image";
import { Suspense, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-fade';

import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";

export default function FadeCarousel({ photos }: { photos: string[] }) {
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

  return (
    <Suspense fallback={<div className="text-center skeleton min-h-[352px]">Loading...</div>}>
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[450px] md:max-w-[600px] aspect-video">
          <Swiper
            key={photos.join(',')}
            modules={[Scrollbar, Mousewheel, Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={10}
            lazyPreloadPrevNext={3}
            slidesPerView={1}
            effect="slide"
            grabCursor={true}
            navigation={true}
            pagination={{ clickable: true }}
            fadeEffect={{ crossFade: true }}
            mousewheel={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            speed={1500}
            className="w-full h-full"
          >
            {photos?.map((item, idx) => {
              const isYoutube = /youtu(be)?/.test(item);
              const isInstagram = /instagram/.test(item);

              let content;
              if (isYoutube) {
                content = <YoutubeEmbed embedHtml={item} width="100%" height="100%" />;
              } else if (isInstagram) {
                content = <InstagramEmbed embedHtml={item} width="100%" height="100%" />;
              } else {
                content = (
                  <div
                    className="relative w-full h-full rounded-lg cursor-zoom-in"
                    onClick={() => setZoomedIdx(idx)}
                  >
                    <Image
                      loading="lazy"
                      placeholder="empty"
                      src={item}
                      alt={item}
                      width={600}
                      height={338}
                      sizes="(max-width: 600px) 100vw, 600px"
                      style={{ objectFit: "contain", width: "100%", height: "100%" }}
                      className="rounded-lg"
                    />
                  </div>
                );
              }

              return (
                <SwiperSlide key={item + idx} className="pb-10 md:pb-13 text-white">
                  <div className="w-full h-full flex justify-center items-center aspect-video">
                    {content}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      {zoomedIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-80 transition-opacity cursor-zoom-out"
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
                src={photos[zoomedIdx!]}
                alt={`Zoomed photo ${zoomedIdx! + 1}`}
                loading="lazy"
                placeholder="empty"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
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