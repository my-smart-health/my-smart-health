'use client'
import { Suspense } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import Image from "next/image";
import Link from "next/link";

type ProfileNewsCarouselItemProps = {
  props?: {
    id: string;
    authorId: string;
    title: string;
    photos: string[];
  }[];
  disableOnInteraction?: boolean;
};

export default function ProfileNewsCarousel({ props, disableOnInteraction = false }: ProfileNewsCarouselItemProps) {

  if (!props || props.length === 0) {
    return <div>No profiles found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div draggable={false}>
        <Swiper
          modules={[Pagination, Mousewheel, Autoplay]}
          spaceBetween={4}
          slidesPerView={4}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}

          pagination={{ clickable: true, enabled: true }}
        >
          {props.map((item) => (
            <SwiperSlide
              key={item.id}
              className="cursor-pointer pb-6">
              <Link href={`/news/${item.id}`}>
                <Image
                  loading="lazy"
                  placeholder="empty"
                  width={400}
                  height={400}
                  alt={item.title}
                  src={item.photos && item.photos.length > 0 ? item.photos[0] : ''}
                  className="rounded-box border-6 border-primary aspect-square"
                />
                <p className="text-center break-words line-clamp-1 text-[#2c2e35] mb-4">{item.title}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense>
  );
}
