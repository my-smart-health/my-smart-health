import NewsCarousel from "@/components/carousels/newsCarousel/NewsCarousel";
import TopCarousel from "@/components/carousels/topCarousel/TopCarousel";
import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/the-health-bar-link/TheHealthBarLink";
import { defaultCarouselItems, defaultNewsItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <main className="flex flex-col items-center gap-8 max-w-[100%] min-h-[100dvh] mb-auto justify-items-center">
      <TopCarousel props={defaultCarouselItems} />
      <NewsCarousel props={defaultNewsItems} />
      <div className="flex flex-col gap-3 w-full mx-auto max-w-[100%]">
        <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
        <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
        <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
        <TheHealthBarLink />
      </div>
    </main>
  );
}
