'use client'
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-fade';
import { Suspense } from "react";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";


export default function FadeCarousel({ photos, disableOnInteraction = true }: { photos: string[]; disableOnInteraction?: boolean }) {
  return (
    <Suspense fallback={<div className="text-center skeleton min-h-[352px]">Loading...</div>}>
      <figure className="w-full max-w-[90%] mx-auto">
        <div className="max-w-xs md:max-w-sm">
          <Swiper
            modules={[Scrollbar, Mousewheel, Autoplay, EffectFade]}
            spaceBetween={0}
            lazyPreloadPrevNext={3}
            slidesPerView={1}
            effect="fade"
            grabCursor={true}
            fadeEffect={{
              crossFade: true
            }}
            mousewheel={true}
            autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
            speed={1500}
            scrollbar={{ draggable: true }}
          >
            {photos && photos.map((item, idx) => {
              const WIDTH = 450;
              const HEIGHT = 150;
              if (item.search('youtu') > 0 || item.search('youtube') > 0) {
                return (
                  <SwiperSlide key={idx}>
                    <div className="flex flex-col justify-center items-center aspect-video rounded-box cursor-pointer max-w-full">
                      <YoutubeEmbed embedHtml={item} width={WIDTH} height={HEIGHT} />
                    </div>
                    <br />
                  </SwiperSlide>
                )
              }
              if (item.search('instagram') > 0) {
                return (
                  <SwiperSlide key={idx}>
                    <div className="flex flex-col justify-center items-center rounded-box cursor-pointer max-w-full">
                      <InstagramEmbed embedHtml={item} width={WIDTH} height={HEIGHT} />
                    </div>
                    <br />
                  </SwiperSlide>
                )
              } else {
                return (
                  <SwiperSlide key={idx}>
                    <div className="flex flex-col justify-center  object-scale-down items-center rounded-box cursor-pointer max-w-full">
                      <Image
                        loading="lazy"
                        placeholder="empty"
                        width={WIDTH}
                        height={HEIGHT}
                        src={item}
                        alt={item}
                        className="aspect-video w-auto h-auto object-scale-down"
                      />
                    </div>
                    <br />
                  </SwiperSlide>
                )
              }
            })}

          </Swiper>
        </div>
      </figure>
    </Suspense>
  );
}