'use client'
import { Suspense } from "react";
import TopCarouselSkeleton from "./TopCarouselSkeleton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import Image from "next/image";
import Link from "next/link";

type TopCarouselItemProps = {
  props?: {
    id: string;
    name: string;
    profileImage: string;
  }[];
  disableOnInteraction?: boolean;
};

export default function TopCarousel({ props, disableOnInteraction = false }: TopCarouselItemProps) {

  if (!props || props.length === 0) {
    return <TopCarouselSkeleton times={7} />;
  }

  return (
    <Suspense fallback={<TopCarouselSkeleton times={7} />}>
      <div draggable={false} className="max-w-2xs md:max-w-sm">
        <Swiper
          modules={[Scrollbar, Mousewheel, Autoplay]}
          spaceBetween={4}
          slidesPerView={4}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}
          scrollbar={{ draggable: true }}
        >
          {props.map((item) => (
            <SwiperSlide
              key={item.id}
              className="cursor-pointer">
              <Link href={`/profile/${item.id}`}>
                <Image
                  loading="lazy"
                  placeholder="empty"
                  width={400}
                  height={400}
                  alt={item.name}
                  src={item.profileImage}
                  className="rounded-box border-6 border-primary aspect-square"
                />
                <p className="text-center text-[#2c2e35] mb-4">{item.name}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
