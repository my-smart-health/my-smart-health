import { ProfileNewsCarouselItem } from "@/utils/types";

import Divider from "@/components/divider/Divider";
import ProfileNewsCarousel from "@/components/carousels/profile-news/ProfileNewsCarousel";

export default function NewsSection({ posts }: { posts: ProfileNewsCarouselItem[] }) {
  if (!posts?.length) return null;

  return (
    <>
      <Divider />
      <h2 className="font-bold text-primary text-xl">News</h2>
      <section className="w-full">
        <ProfileNewsCarousel carouselItems={posts} />
      </section>
    </>
  );
}