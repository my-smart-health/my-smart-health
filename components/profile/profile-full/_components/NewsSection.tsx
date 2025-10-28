import { ProfileNewsCarouselItem } from "@/utils/types";

import Divider from "@/components/divider/Divider";
import ProfileNewsCarousel from "@/components/carousels/profile-news/ProfileNewsCarousel";

export default function NewsSection({ posts }: { posts: ProfileNewsCarouselItem[] }) {
  if (!posts?.length) return null;

  return (
    <>
      <Divider addClass="my-4" />
      <h2 className="font-bold text-primary text-xl mb-2">News</h2>
      <section className="w-full border border-primary rounded-lg p-4 bg-white/90 shadow-sm">
        <ProfileNewsCarousel carouselItems={posts} />
      </section>
    </>
  );
}