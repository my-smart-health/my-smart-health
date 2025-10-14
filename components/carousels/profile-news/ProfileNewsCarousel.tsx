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
import { ProfileNewsCarouselItem } from "@/utils/types";
import { PAGINATION_BULLET_QUANTITY } from "@/utils/constants";

type ProfileNewsCarouselItemProps = {
  carouselItems: ProfileNewsCarouselItem[];
  disableOnInteraction?: boolean;
};

export default function ProfileNewsCarousel({ carouselItems, disableOnInteraction = false }: ProfileNewsCarouselItemProps) {

  if (!carouselItems || carouselItems.length === 0) {
    return <div>No profiles found</div>;
  }

  return (
    <Suspense fallback={<div className="text-center w-full">Loading...</div>}>
      <div draggable={false}>
        <Swiper
          modules={[Pagination, Mousewheel, Autoplay]}
          spaceBetween={4}
          slidesPerView={4}
          mousewheel={true}
          autoplay={{ delay: 3000, disableOnInteraction: disableOnInteraction, pauseOnMouseEnter: true, waitForTransition: true }}
          speed={300}
          pagination={{ clickable: true, enabled: true, dynamicBullets: true, dynamicMainBullets: PAGINATION_BULLET_QUANTITY }}
        >
          {carouselItems.map((item) => (
            <SwiperSlide
              key={item.id}
              className="cursor-pointer pb-6">
              <div
                className="relative"
              >
                <Link href={`/news/${item.id}`} className="link hover:text-primary">
                  <Image
                    loading="lazy"
                    placeholder="empty"
                    width={300}
                    height={300}
                    alt={item.title}
                    src={item.photos && item.photos.length > 0 ? item.photos[0] : ''}
                    style={{ objectFit: "contain", width: "auto", height: "auto" }}
                    className="rounded-box border-3 border-primary aspect-square"
                  />
                  <span className="text-center space-x-0.5 line-clamp-1 max-w-[80%] mx-auto text-lg mb-4">{item.title}</span>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Suspense >
  );
}
