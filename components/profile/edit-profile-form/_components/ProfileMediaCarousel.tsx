import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";

export function ProfileMediaCarousel({ blobResult }: { blobResult: string[] }) {

  return (
    <section>
      <div className="flex flex-col justify-center items-center content-center max-w-full">
        {blobResult.length > 0 ? (
          <FadeCarousel photos={blobResult} />
        ) : (
          <div className="flex justify-center items-center text-center skeleton min-h-80 w-full font-bold">No Images</div>
        )}
      </div>
    </section>
  );
}