'use client';

import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import { useTranslations } from 'next-intl';

export function ProfileMediaCarousel({ blobResult }: { blobResult: string[] }) {
  const t = useTranslations('EditProfileForm');

  return (
    <section>
      <div className="flex flex-col justify-center items-center content-center max-w-full">
        {blobResult.length > 0 ? (
          <FadeCarousel photos={blobResult} />
        ) : (
          <div className="flex justify-center items-center text-center skeleton min-h-80 w-full font-bold">{t('mediaCarousel.noImages')}</div>
        )}
      </div>
    </section>
  );
}