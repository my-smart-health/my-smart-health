'use client'

import { NewsCardType } from "@/utils/types";

import GoBack from "@/components/buttons/go-back/GoBack";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import { Suspense } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import SeeMoreLess from "@/components/buttons/see-more-less/SeeMoreLess";
import GoToButton from "@/components/buttons/go-to/GoToButton";

export default function NewsCardDetails({ newsData, session }: { newsData: NewsCardType | null, session?: Session | null }) {

  const { id, title, content, createdAt, photos, author, tags } = newsData || {};

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
            <div className="card card-lg w-96 shadow-sm max-w-[100%]">

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

              <div className="card-body">
                {photos &&
                  <Suspense fallback={<div>Loading...</div>}>
                    <FadeCarousel photos={photos} />
                  </Suspense>
                }

                {content && <div className="text-base indent-4 break-before"><SeeMoreLess text={content} /></div>}

              </div>

              <div className="card-actions justify-end m-4">
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span key={index} className="badge badge-dash">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 mb-4">
              {author?.name &&
                <div className="card-actions justify-center">
                  <GoToButton name={`zum Anbieter ${author.name}`} src={`/profile/${author.id}`} className="btn btn-wide bg-primary rounded-xl text-secondary" />
                </div>
              }

              {session?.user.role === "ADMIN" || session?.user.id === author?.id
                ? <Link href={`/dashboard/edit-post/${id}`} className="self-center btn btn-wide btn-warning rounded-xl">Edit Post</Link>
                : null
              }
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