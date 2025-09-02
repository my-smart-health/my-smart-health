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

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function FadeCarousel({ photos }: { photos: string[] }) {
  return (
    <Suspense fallback={<div className="text-center skeleton min-h-[352px]">Loading...</div>}>
      <figure>
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
            autoplay={{ delay: 3000, disableOnInteraction: true }}
            speed={1500}
            scrollbar={{ draggable: true }}
          >
            {photos && photos.map((item, idx) => (
              <SwiperSlide key={idx}>
                {item.search('youtu') > 0 ? (
                  <div className="flex flex-col justify-center items-center rounded-box cursor-pointer max-w-full">
                    <iframe
                      key={idx}
                      width="560"
                      height="315"
                      src={getYoutubeEmbedUrl(item)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                      allowFullScreen
                      className="aspect-video w-full object-center object-cover"
                    ></iframe>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center rounded-box cursor-pointer max-w-full">
                    <Image
                      loading="lazy"
                      placeholder="empty"
                      width={450}
                      height={150}
                      src={item}
                      alt={item}
                      className="aspect-video w-full object-center object-cover"
                    />
                  </div>
                )}
                <br />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </figure>
    </Suspense>
  );
}