import { Session } from "next-auth";
import { getTranslations } from "next-intl/server";
import { NewsCardType } from "@/utils/types";
import PostCard from "@/components/posts/post-card/PostCard";

interface NewsListProps {
  posts: NewsCardType[];
  session: Session | null;
}

export default async function NewsList({ posts, session }: NewsListProps) {
  const t = await getTranslations('NewsList');

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noPostsFound')}
      </div>
    );
  }

  return <PostCard posts={posts} session={session} />;
}
