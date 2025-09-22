import dynamic from "next/dynamic";

const ProfilePictureCarousel = dynamic(
  () => import("@/components/carousels/profile-picture-carousel/ProfilePictureCarousel"),
  { ssr: false }
);

type Props = {
  images: string[];
};

export default function ProfilePictureSection({ images }: Props) {
  if (!images?.length) return null;
  return (
    <section
      className="w-full max-w-[500px] mx-auto aspect-video min-h-[330px] md:min-h-[340px] flex items-center justify-center"
      style={{ position: "relative" }}
    >
      <ProfilePictureCarousel imageSrcArray={images} />
    </section>
  );
}