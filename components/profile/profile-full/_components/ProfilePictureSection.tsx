"use client";

import Divider from "@/components/divider/Divider";
import ProfilePictureCarousel from "@/components/carousels/profile-picture-carousel/ProfilePictureCarousel";

type Props = {
  images: string[];
};

export default function ProfilePictureSection({ images }: Props) {
  if (!images?.length) return null;
  const imageBullets = images.length > 1 ? "min-h-[330px] md:min-h-[340px]" : "min-h-fit pt-5 my-4 md:min-h-[140px]";
  return (
    <>
      <Divider addClass="my-1" />
      <section
        className={`w-full max-w-[500px] mx-auto aspect-video flex items-center justify-center ${imageBullets}`}
        style={{ position: "relative" }}
      >
        <ProfilePictureCarousel imageSrcArray={images} />
      </section>
    </>
  );
}