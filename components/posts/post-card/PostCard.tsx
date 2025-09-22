'use client'

import { Session } from "next-auth";
import { useEffect, useState } from "react";

import { NewsCardType } from "@/utils/types";

import PostCardDetails from "./PostCardDetails";

type PostCardProps = {
  posts: NewsCardType[];
  session?: Session | null;
}

export default function PostCard({ posts, session }: PostCardProps) {
  const [postsState, setPostsState] = useState<NewsCardType[]>([]);

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  const handleDeletePost = (deletedId: string) => {
    setPostsState(prev => prev.filter(post => post.id !== deletedId));
  };

  if (!postsState.length) {
    return <div className="text-gray-400 text-center">No active posts</div>;
  }

  return (
    <>
      {postsState.map((post) => (
        <PostCardDetails
          key={post.id}
          postData={post}
          session={session}
          onDeletePostAction={handleDeletePost}
        />
      ))}
    </>
  );
}