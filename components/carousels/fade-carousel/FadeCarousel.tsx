'use client'
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-fade';
import { Suspense } from "react";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";

export default function FadeCarousel({ photos, width = 450, height = 135 }: { photos: string[], width?: number, height?: number }) {
  return (
    <Suspense fallback={<div className="text-center skeleton min-h-[352px]">Loading...</div>}>
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[450px] md:max-w-[600px] aspect-video">
          <Swiper
            modules={[Scrollbar, Mousewheel, Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={0}
            lazyPreloadPrevNext={3}
            slidesPerView={1}
            effect="fade"
            grabCursor={true}
            navigation={true}
            pagination={{
              clickable: true,

            }}
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
                  <Image
                    loading="lazy"
                    placeholder="empty"
                    src={item}
                    alt={item}
                    fill
                    sizes="(max-width: 600px) 100vw, 600px"
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                );
              }

              return (
                <SwiperSlide key={idx} className="pb-10 text-white">
                  <div className="relative w-full h-full flex justify-center items-center aspect-video">
                    {content}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </Suspense>
  );
}