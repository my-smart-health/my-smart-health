'use client'

import { NewsCardType } from "@/utils/types";

import GoBack from "@/components/buttons/go-back/GoBack";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import { Suspense } from "react";
import Link from "next/link";
import { Session } from "next-auth";

export default function NewsCardDetails({ newsData, session }: { newsData: NewsCardType | null, session?: Session | null }) {

  const { id, title, content, createdAt, photos, author } = newsData || {};
  const createdDate = new Date(createdAt ? createdAt : '').toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return (
    <>
      {newsData ? (
        <>
          <div
            key={id}
            className="m-auto min-h-full border max-w-[99%] rounded-lg shadow-2xl"
          >
            <div className="card card-lg bg-secondary/20 w-96 shadow-sm max-w-[100%]">

              <div className="badge badge-accent rounded-bl-none rounded-tr-none p-4">{createdDate}</div>

              {session?.user.role === "ADMIN" || session?.user.id === author?.id
                && <div className="self-center btn btn-wide btn-warning rounded-xl mt-4"><Link href={`/edit-post/${id}`}>Edit Post</Link></div>
              }

              {author?.name && <div className="text-2xl indent-6 mt-3 text-primary">
                <Link
                  href={`/profile/${author.id}`}
                  className="hover:underline">
                  {author?.name || "Unknown Author"}
                </Link></div>}

              {author?.fieldOfExpertise &&
                <div className="card-actions mt-1 pt-1 justify-start gap-2 mx-4">
                  {
                    author?.fieldOfExpertise.map((expertise, index) => (
                      <div key={index} className="badge badge-outline">{expertise}</div>
                    ))}
                </div>
              }

              <h2 className="card-title card-border flex-col m-4 justify-center">
                {title}
              </h2>

              <div className="card-body">
                {photos &&
                  <Suspense fallback={<div>Loading...</div>}>
                    <FadeCarousel photos={photos} />
                  </Suspense>
                }

                <p className="text-base text-pretty indent-4 break-before">{content}</p>

              </div>
            </div>
          </div>
          <div className="flex justify-end my-2">
            <GoBack />
          </div>
        </>
      ) : (
        <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No data found</div>
      )}
    </>
  );
}