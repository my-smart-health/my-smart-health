import { Session } from "next-auth";
import { NewsCardType } from "@/utils/types";
import PostCard from "@/components/posts/post-card/PostCard";

interface NewsListProps {
  posts: NewsCardType[];
  session: Session | null;
}

export default function NewsList({ posts, session }: NewsListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No news posts found.
      </div>
    );
  }

  return <PostCard posts={posts} session={session} />;
}
