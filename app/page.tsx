import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import { defaultCarouselItems, defaultNewsItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <div className="font-sans flex flex-col h-screen justify-items-center gap-16 sm:p-20 ">
      <main className="flex flex-col items-center gap-8 min-h-screen">
        <div className="max-w-[85vw] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[36vw]">
          <TopCarousel props={defaultCarouselItems} />
        </div>
        <div className="max-w-[85vw] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[36vw]">
          <NewsCarousel props={defaultNewsItems} />
        </div>
      </main>
    </div>
  );
}
