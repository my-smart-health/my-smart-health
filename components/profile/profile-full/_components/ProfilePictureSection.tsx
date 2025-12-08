"use client";

import Divider from "@/components/divider/Divider";
import ProfilePictureCarousel from "@/components/carousels/profile-picture-carousel/ProfilePictureCarousel";

type Props = {
  images: string[];
};

export default function ProfilePictureSection({ images }: Props) {
  if (!images?.length) return null;

  return (
    <section className="w-full max-w-[500px] mx-auto flex items-center justify-center py-2">
      <ProfilePictureCarousel imageSrcArray={images} />
    </section>
  );
}