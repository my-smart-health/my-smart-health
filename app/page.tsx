import TopCarousel from "@/components/carousels/TopCarousel";
import { defaultCarouselItems } from "@/data/mockup-data";

export default function Home() {

  return (
    <div className="font-sans flex flex-col h-screen justify-items-center min-h-screen p-8 gap-16 sm:p-20 ">
      <main className="flex flex-col gap-8 min-h-screen">
        <TopCarousel />
        <h1>My Smart Health</h1>
      </main>

    </div>
  );
}
