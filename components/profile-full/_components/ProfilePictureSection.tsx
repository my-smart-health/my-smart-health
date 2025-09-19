import dynamic from "next/dynamic";

const ProfilePictureCarousel = dynamic(
  () => import("@/components/carousels/profile-picture-carousel/ProfilePictureCarousel"),
  { ssr: false }
);

export default function ProfilePictureSection({ images }: { images: string[] }) {
  if (!images?.length) return null;
  return (
    <section
      className="w-full max-w-[500px] mx-auto aspect-video min-h-[430px] md:min-h-[430px] flex items-center justify-center"
      style={{ position: "relative" }}
    >
      <ProfilePictureCarousel imageSrcArray={images} />
    </section>
  );
}