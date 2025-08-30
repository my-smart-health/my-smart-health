'use client'

import { NewsCardType } from "@/utils/types";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-fade';

import GoBack from "@/components/buttons/go-back/GoBack";

export default function NewsCardDetails({ newsData }: { newsData: NewsCardType | null }) {

  const { id, title, content, createdAt, photos, author } = newsData || {};
  const createdDate = new Date(createdAt ? createdAt : '').toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return (
    <>
      {newsData ? (
        <>
          <div
            key={id}
            className="m-auto min-h-full border max-w-[99%] rounded-lg shadow-2xl"
          >
            <div className="card card-lg bg-secondary/20 w-96 shadow-sm max-w-[100%]">
              <div className="badge badge-accent rounded-bl-none rounded-tr-none p-4">{createdDate}</div>
              {author?.name && <div className="text-2xl indent-6 mt-3">{author?.name || "Unknown Author"}</div>}
              <h2 className="card-title card-border flex-col m-4 justify-center">
                {title}
              </h2>
              <div className="card-body">
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
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      speed={1500}
                      scrollbar={{ draggable: true }}
                    >
                      {photos && photos.map((item, idx) => (
                        <SwiperSlide key={idx}>
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
                          <br />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </figure>
                <p className="text-base text-pretty indent-4 break-before">{content}</p>
                {author?.fieldOfExpertise &&
                  <div className="card-actions mt-1 pt-1 justify-end">
                    {
                      author?.fieldOfExpertise.map((expertise, index) => (
                        <div key={index} className="badge badge-outline">{expertise}</div>
                      ))}
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="flex justify-end my-2">
            <GoBack />
          </div>
        </>
      ) : (
        <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No data found</div>
      )}
    </>
  );
}