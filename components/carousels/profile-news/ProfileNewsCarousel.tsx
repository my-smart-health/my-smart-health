'use client'
import { Suspense, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import Image from "next/image";
import Link from "next/link";
import { ProfileNewsCarouselItem } from "@/utils/types";

type ProfileNewsCarouselItemProps = {
  carouselItems: ProfileNewsCarouselItem[];
  disableOnInteraction?: boolean;
};

export default function ProfileNewsCarousel({ carouselItems, disableOnInteraction = false }: ProfileNewsCarouselItemProps) {
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

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
          pagination={{ clickable: true, enabled: true }}
        >
          {carouselItems.map((item, idx) => (
            <SwiperSlide
              key={item.id}
              className="cursor-pointer pb-6">
              <div
                className="relative"
              >
                <Image
                  loading="lazy"
                  placeholder="empty"
                  width={300}
                  height={300}
                  alt={item.title}
                  src={item.photos && item.photos.length > 0 ? item.photos[0] : ''}
                  style={{ objectFit: "contain", width: "auto", height: "auto" }}
                  className="rounded-box border-3 border-primary aspect-square cursor-zoom-in"
                  onClick={e => {
                    e.preventDefault();
                    setZoomedIdx(idx);
                  }}
                />
                <Link href={`/news/${item.id}`} className="link hover:text-primary">
                  <span className="text-center space-x-0.5 line-clamp-1 text-lg mb-4">{item.title}</span>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {
        zoomedIdx !== null && (
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
                  src={carouselItems[zoomedIdx!].photos && carouselItems[zoomedIdx!].photos.length > 0 ? carouselItems[zoomedIdx!].photos[0] : ''}
                  alt={`Zoomed photo ${zoomedIdx! + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        )
      }
    </Suspense >
  );
}
