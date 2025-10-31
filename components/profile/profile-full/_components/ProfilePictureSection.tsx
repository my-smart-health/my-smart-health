"use client";

import Divider from "@/components/divider/Divider";
import ProfilePictureCarousel from "@/components/carousels/profile-picture-carousel/ProfilePictureCarousel";

type Props = {
  images: string[];
};

export default function ProfilePictureSection({ images }: Props) {
  if (!images?.length) return null;
  return (
    <>
      <Divider addClass="my-2" />
      <section
        className="w-full max-w-[500px] mx-auto aspect-video min-h-[330px] md:min-h-[340px] flex items-center justify-center"
        style={{ position: "relative" }}
      >
        <ProfilePictureCarousel imageSrcArray={images} />
      </section>
    </>
  );
}