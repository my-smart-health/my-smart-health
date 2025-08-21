import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/the-health-bar-link/TheHealthBarLink";
import { defaultCarouselItems, defaultNewsItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <div className="font-sans flex flex-col min-h-[100dvh] justify-items-center">
      <main className="flex flex-col items-center gap-8 max-w-md">
        <div className="flex flex-col items-center gap-8">
          <TopCarousel props={defaultCarouselItems} />
          <NewsCarousel props={defaultNewsItems} />
        </div>
        <div className="flex flex-col gap-3 w-full mx-auto max-w-[90%] mb-2">
          <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
          <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/news" />
          <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/news" />
          <TheHealthBarLink />
        </div>
      </main>
    </div>
  );
}
