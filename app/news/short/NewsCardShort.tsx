import Link from "next/link";
import { Suspense } from "react";
import { Session } from "next-auth";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";

import { NewsCardType } from "@/utils/types";


export default function NewsCardShort({ newsData, session }: { newsData: NewsCardType | null, session?: Session | null }) {
  const { id, title, content, createdAt, author, tags } = newsData || {};

  const photos = newsData?.photos || [];

  const createdDate = createdAt
    ? createdAt.toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    : "Unknown Date";


  return (
    <div
      key={id}
      className="m-auto min-h-full border max-w-[99%] rounded-lg shadow-2xl"
    >
      <div className="card card-lg w-96 shadow-sm max-w-[100%] ">

        <div className="flex flex-row gap-2">

          {author?.name && (
            <span className="text-2xl text-primary w-full m-2 font-semibold">
              <Link
                href={`/profile/${author.id}`}
                className="hover:underline"
              >
                {author?.name || "Unknown Author"}
              </Link>
            </span>
          )}

          <span className="badge badge-accent rounded-br-none rounded-tl-none py-4 px-1">{createdDate}</span>
        </div>

        <div className="card-actions mt-1 pt-1 justify-start gap-2 mx-4">
          {
            author?.fieldOfExpertise.map((expertise, index) => (
              <div key={index} className="badge badge-outline">{expertise}</div>
            ))}
        </div>
        <h2 className="card-title card-border flex-col m-4 justify-center">
          {title}
        </h2>
        <div className="flex flex-col gap-1  mb-4 w-full">
          <div className="w-full">
            <Suspense fallback={<div className="text-center skeleton min-h-[352px]">Loading...</div>}>
              <FadeCarousel photos={photos} />
            </Suspense>
          </div>
          <p className="text-base mx-4 line-clamp-3 indent-6">{content}</p>

          <div className="card-actions justify-end m-4">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="badge badge-dash">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="card-actions justify-center">
            <GoToButton name={"View more"} src={`/news/${id}`} className="btn btn-wide bg-primary rounded-xl text-secondary" />
          </div>

          {session?.user.role === "ADMIN" || session?.user.id === author?.id
            ? <Link href={`/dashboard/edit-post/${id}`} className="self-center btn btn-wide btn-warning rounded-xl">Edit Post</Link>
            : null
          }
        </div>
      </div>
    </div>
  )
};