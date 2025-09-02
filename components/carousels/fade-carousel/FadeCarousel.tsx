import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Mousewheel, Scrollbar } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-fade';

export default function FadeCarousel({ photos }: { photos: string[] }) {
  return (
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
  )
}