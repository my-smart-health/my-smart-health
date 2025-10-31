import { Session } from "next-auth";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import ParagraphContent from "@/components/common/ParagraphContent";

type Posts = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  photos: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date | null;
}

export default function ShortPosts({ posts, session = null }: { posts: Posts[]; session?: Session | null }) {
  return (
    <div className="flex flex-col gap-2">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-secondary/20 rounded-lg p-3 shadow-xl">

            <div
              className="badge badge-accent rounded-bl-none rounded-tr-none mb-2 p-4">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>

            <h3 className="font-semibold text-lg">
              {post.title}
            </h3>

            <section className="my-2 mx-auto w-full flex place-content-center items-center">
              <FadeCarousel photos={post.photos} />
            </section>

            <div className="text-gray-600">
              <ParagraphContent content={post.content} />
            </div>

            <div
              className="flex flex-row-reverse gap-2 mt-4 mb-2">
              <GoToButton
                src={`/news/${post.id}`}
                name="View Post"
                className="btn btn-primary shadow" />
              {session?.user.id === post.authorId || session?.user.role === "ADMIN" ? (
                <GoToButton
                  src={`/dashboard/edit-post/${post.id}`}
                  name="Edit Post"
                  className="btn btn-dash shadow" />
              ) : null}
            </div>
          </div>
        ))
      ) : (
        <span className="text-gray-400">No active posts</span>
      )}
    </div>
  );
}