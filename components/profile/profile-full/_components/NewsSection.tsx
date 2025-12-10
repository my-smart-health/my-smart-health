import { ProfileNewsCarouselItem } from "@/utils/types";

import ProfileNewsCarousel from "@/components/carousels/profile-news/ProfileNewsCarousel";

export default function NewsSection({ posts }: { posts: ProfileNewsCarouselItem[] }) {
  if (!posts?.length) return null;

  return (
    <section className="w-full">
      <h2 className="font-bold text-primary text-xl mb-2">News</h2>
      <div className="w-full h-fit border border-primary rounded-lg p-2 shadow-sm">
        <ProfileNewsCarousel carouselItems={posts} />
      </div>
    </section>
  );
}