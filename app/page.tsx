import TopCarousel from "@/components/carousels/TopCarousel";
import { defaultCarouselItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <div className="font-sans flex flex-col h-screen justify-items-center gap-16 sm:p-20 ">
      <main className="flex flex-col items-center gap-8 min-h-screen">
        <div className="max-w-[85vw] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[36vw]">
          <TopCarousel props={defaultCarouselItems} />
        </div>
        <h1>My Smart Health</h1>
      </main>

    </div>
  );
}
