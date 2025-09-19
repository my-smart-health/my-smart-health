import { Suspense } from "react";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import { MAX_FILES_PER_USER } from "@/utils/constants";

export function ProfileMediaCarousel({ blobResult }: { blobResult: string[] }) {
  return (
    <section>
      <div className="flex flex-col justify-center items-center content-center max-w-full">
        {blobResult && blobResult.length > 0 ? (
          <div className="max-w-full">
            <Suspense fallback={<div className={`text-center skeleton min-h-[${MAX_FILES_PER_USER}]`}>Loading...</div>}>
              <FadeCarousel photos={blobResult} />
            </Suspense>
          </div>
        ) : (
          <div className="text-center skeleton min-h-[352px]">No Images</div>
        )}
      </div>
    </section>
  );
}