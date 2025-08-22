import TheHealthBarCarousel from "@/components/carousels/theHealthBarCarousel/TheHealthBarCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import { defaultCarouselItems, defaultHealthBarItems } from "@/data/mockup-data";
import Image from "next/image";

export default function TheHealthBarPage() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center mx-auto mb-auto max-w-[90%] overflow-clip">
      <TopCarousel props={defaultCarouselItems} />
      <TheHealthBarCarousel props={defaultHealthBarItems} />
      <Image loading="lazy" placeholder="empty" src="/healthbar.png" alt="Health Bar" width={410} height={130} className="self-center w-full max-w-full aspect-auto h-auto" />
    </div>
  );
}
