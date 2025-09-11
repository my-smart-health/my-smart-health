'use client'
import { Suspense } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCube, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cube';
import NewsCarouselSkeleton from "./NewsCarouselSkeleton";
import Link from "next/link";

type NewsCarouselProps = {
  props?: {
    id: string;
    image: string;
    info: string;
  }[];
  disableOnInteraction?: boolean;
};

export default function NewsCarousel({ props, disableOnInteraction = false }: NewsCarouselProps) {

  if (!props || props.length === 0) {
    return <NewsCarouselSkeleton />;
  }

  return (
    <Suspense fallback={<NewsCarouselSkeleton />}>
      <div className="mx-auto max-w-2xs min-h-[300px] md:max-w-sm">
        <Swiper
          modules={[Scrollbar, Mousewheel, Autoplay, EffectCube]}
          spaceBetween={0}
          slidesPerView={1}
          effect="cube"
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94
          }}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}
          scrollbar={{ draggable: true }}
        >
          {props.map((item) => (
            <SwiperSlide key={item.id}>
              <Link href={`/news/short/${item.id}`}>
                <div className="flex flex-col justify-center items-center rounded-box cursor-pointer">
                  <Image
                    loading="lazy"
                    placeholder="empty"
                    width={400}
                    height={400}
                    src={item.image}
                    alt={item.info}
                    className="aspect-square rounded-t-lg"
                  />
                  <span className="text-center line-clamp-1 p-1 text-white text-3xl w-full bg-primary rounded-b-lg">
                    {item.info}
                  </span>
                </div>
              </Link>
              <br />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
