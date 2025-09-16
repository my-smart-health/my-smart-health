'use client'
import { Suspense } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCube, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
};

export default function NewsCarousel({ props }: NewsCarouselProps) {

  if (!props || props.length === 0) {
    return <NewsCarouselSkeleton />;
  }

  return (
    <Suspense fallback={<NewsCarouselSkeleton />}>
      <div className="mx-auto max-w-2xs min-h-[300px] md:max-w-sm">
        <Swiper
          modules={[Scrollbar, Navigation, Pagination, Mousewheel, Autoplay, EffectCube]}
          spaceBetween={0}
          slidesPerView={1}
          effect="cube"
          grabCursor={true}
          navigation={true}
          pagination={{ clickable: true, enabled: true }}
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94
          }}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: true, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}
        >
          {props.map((item) => (
            <SwiperSlide key={item.id}>
              <Link href={`/news/${item.id}`}>
                <div className="flex flex-col border-2 border-primary justify-center items-center rounded-box cursor-pointer">
                  <Image
                    loading="lazy"
                    placeholder="empty"
                    width={400}
                    height={400}
                    src={item.image}
                    alt={item.info}
                    style={{ objectFit: "contain" }}
                    className="aspect-square rounded-t-lg"
                  />
                  <span className="text-center line-clamp-1 p-1 text-white text-xl w-full bg-primary rounded-b">
                    {item.info}
                  </span>
                </div>
              </Link>
              <br />
              <br />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
