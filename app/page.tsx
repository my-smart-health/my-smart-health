import TopCarousel from "@/components/carousels/TopCarousel";
import { defaultCarouselItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <div className="font-sans flex flex-col h-screen justify-items-center gap-16 sm:p-20 ">
      <main className="flex flex-col items-center gap-8 min-h-screen">
        <TopCarousel props={defaultCarouselItems} />
        <h1>My Smart Health</h1>
      </main>

    </div>
  );
}
