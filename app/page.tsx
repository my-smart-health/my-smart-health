import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/the-health-bar-link/TheHealthBarLink";
import { defaultCarouselItems, defaultNewsItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <div className="font-sans flex flex-col min-h-[100dvh] justify-items-center">
      <main className="flex flex-col items-center gap-8 max-w-md">
        <TopCarousel props={defaultCarouselItems} />
        <NewsCarousel props={defaultNewsItems} />
        <div className="flex flex-col gap-3 w-full mx-auto max-w-[90%]">
          <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
          <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
          <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
          <TheHealthBarLink />
        </div>
      </main>
    </div>
  );
}
