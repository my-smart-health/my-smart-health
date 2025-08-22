import TheHealthBarCarousel from "@/components/carousels/theHealthBarCarousel/TheHealthBarCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import TheHealthBarInfo from "@/components/the-health-bar-info/TheHealthBarInfo";
import { defaultCarouselItems, defaultHealthBarItems } from "@/data/mockup-data";
import Image from "next/image";

export default function TheHealthBarPage() {

  return (
    <main className="flex flex-col gap-3 justify-center items-center mx-auto mb-auto max-w-[90%] overflow-clip">
      <div className="max-w-[95%]">
        <TopCarousel props={defaultCarouselItems} />
        <TheHealthBarCarousel props={defaultHealthBarItems} />
        <Image loading="lazy" placeholder="empty" src="/healthbar.png" alt="Health Bar" width={410} height={130} className="self-center w-full max-w-full aspect-auto h-auto" />
      </div>
      <div className="flex border w-full border-primary"></div>

      <div className="flex border w-full border-primary"></div>
      <TheHealthBarInfo />
    </main>
  );
}
