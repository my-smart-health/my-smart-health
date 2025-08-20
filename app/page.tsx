import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import { defaultCarouselItems, defaultNewsItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <div className="font-sans flex flex-col h-[100dvh] justify-items-center">
      <main className="flex flex-col items-center gap-8">
        <div className="flex flex-col gap-4 sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[30vw] max-w-[90vw]">
          <TopCarousel props={defaultCarouselItems} />
          <NewsCarousel props={defaultNewsItems} />
        </div>
      </main>
    </div>
  );
}
