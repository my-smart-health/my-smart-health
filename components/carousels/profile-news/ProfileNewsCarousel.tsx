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
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

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
          {props.map((item, idx) => (
            <SwiperSlide
              key={item.id}
              className="cursor-pointer pb-6">
              <div
                className="relative"
              >
                <Image
                  loading="lazy"
                  placeholder="empty"
                  width={400}
                  height={400}
                  alt={item.title}
                  src={item.photos && item.photos.length > 0 ? item.photos[0] : ''}
                  className="rounded-box border-6 border-primary aspect-square cursor-zoom-in"
                  onClick={e => {
                    e.preventDefault();
                    setZoomedIdx(idx);
                  }}
                />
                <Link href={`/news/${item.id}`} className="link">
                  <p className="text-center break-words line-clamp-1 text-[#2c2e35] mb-4">{item.title}</p>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {zoomedIdx !== null && (
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
                src={props[zoomedIdx!].photos && props[zoomedIdx!].photos.length > 0 ? props[zoomedIdx!].photos[0] : ''}
                alt={`Zoomed photo ${zoomedIdx! + 1}`}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
