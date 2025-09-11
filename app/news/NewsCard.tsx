'use client'

import Link from "next/link";
import { Suspense } from "react";

import { NewsCardType } from "@/utils/types";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import { Session } from "next-auth";
import NewsCardShort from "./short/NewsCardShort";

export default function NewsCard({ newsData, session }: { newsData: NewsCardType[] | NewsCardType, session?: Session | null }) {
  return (
    <>
      {newsData ? (
        Array.isArray(newsData) ? (
          newsData.length > 0 ? (
            newsData.map((news: NewsCardType) => (
              <NewsCardShort key={news.id} newsData={news} session={session} />
            ))
          ) : (
            <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No News found</div>
          )
        ) : (
          <NewsCardShort newsData={newsData as NewsCardType} session={session} />
        )
      ) : (
        <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No News found</div>
      )}
    </>
  )
}