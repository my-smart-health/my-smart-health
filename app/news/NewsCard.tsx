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

import GoToButton from "@/components/buttons/go-to/GoToButton";

export default function NewsCard({ newsData }: { newsData: NewsCardType[] }) {
  return (
    <>
      {newsData ? newsData.map((news) => {
        const { id, title, content, createdAt, photos, author } = news;

        const createdDate = new Date(createdAt).toLocaleString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        return (
          <div
            key={id}
            className="m-auto min-h-full border max-w-[90%] rounded-lg shadow-2xl"
          >
            <div className="card bg-secondary/20 w-96 shadow-sm max-w-[100%]">
              <div className="badge badge-accent rounded-bl-none rounded-tr-none p-4">{createdDate}</div>
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
                      {photos.map((item, idx) => (
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
                <p className="text-base line-clamp-3">{content}</p>
                <div className="card-actions justify-end">
                  {
                    author?.fieldOfExpertise.map((expertise, index) => (
                      <div key={index} className="badge badge-outline">{expertise}</div>
                    ))}
                </div>
                <div className="card-actions justify-center">
                  <GoToButton name={"View more"} src={`/news/${id}`} className="btn btn-wide bg-primary rounded-xl text-secondary" />
                </div>
              </div>
            </div>
          </div>
        );
      }) : (
        <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No News found</div>
      )}
    </>
  );
}