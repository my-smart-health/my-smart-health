'use client'

import { NewsCardType } from "@/utils/types";

import { Session } from "next-auth";
import PostCardDetails from "./PostCardDetails";

export default function PostCard({ newsData, session }: { newsData: NewsCardType[] | NewsCardType, session?: Session | null }) {
  return (
    <>
      {newsData ? (
        Array.isArray(newsData) ? (
          newsData.length > 0 ? (
            newsData.map((news: NewsCardType) => (
              <PostCardDetails key={news.id} newsData={news} session={session} />
            ))
          ) : (
            <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No News found</div>
          )
        ) : (
          <PostCardDetails newsData={newsData} session={session} />
        )
      ) : (
        <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No News found</div>
      )}
    </>
  )
}