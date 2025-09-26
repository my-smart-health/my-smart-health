import Image from "next/image";

import GoBack from "@/components/buttons/go-back/GoBack";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import TheHealthBarInfo from "@/components/the-health-bar-info/TheHealthBarInfo";
import ProfilePictureCarousel from "@/components/carousels/profile-picture-carousel/ProfilePictureCarousel";

import { defaultCarouselItems, defaultHealthBarItems } from "@/data/mockup-data";



export default function TheHealthBarPage() {
  const healthBarItems = defaultHealthBarItems.map(item => item.imageSrc);
  return (
    <>
      <div className="max-w-[95%]">
        {defaultCarouselItems && <TopCarousel props={defaultCarouselItems} />}
        {healthBarItems && <ProfilePictureCarousel imageSrcArray={healthBarItems} />}
        <div className="flex justify-end mt-4">
          <GoBack />
        </div>
        <Image loading="lazy" placeholder="empty" src="/healthbar.png" alt="Health Bar" style={{ objectFit: "contain", width: "100%", height: "auto" }} width={410} height={130} className="self-center w-full max-w-full aspect-auto h-auto" />
      </div>
      <div className="flex border w-full border-primary"></div>

      <div className="flex border w-full border-primary"></div>
      <TheHealthBarInfo />
    </>
  );
}
