'use client'

import Link from "next/link";
import { Suspense } from "react";
import { Session } from "next-auth";

import { NewsCardType } from "@/utils/types";

import GoBack from "@/components/buttons/go-back/GoBack";
import GoToButton from "@/components/buttons/go-to/GoToButton";
import SeeMoreLess from "@/components/buttons/see-more-less/SeeMoreLess";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import { Divide } from "lucide-react";
import Divider from "@/components/divider/Divider";

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
            className="card m-auto min-h-full w-96 border max-w-[99%] rounded-lg shadow-2xl"
          >
            <div className="flex flex-row gap-2 w-full">

              {title && (
                <span className="text-xl w-full m-5 font-semibold">
                  {title}
                </span>
              )}

              <span className="badge badge-accent rounded-br-none rounded-tl-none py-4 px-1">{createdDate}</span>
            </div>
            <Divider />
            <section>
              <div className="card-body">
                {photos &&
                  <Suspense fallback={<div>Loading...</div>}>
                    <FadeCarousel photos={photos} />
                  </Suspense>
                }
                {content && <div className="text-base indent-4 break-before"><SeeMoreLess text={content} /></div>}
              </div>
              <Divider />
              <div className="card-actions justify-end m-4">
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span key={index} className="badge badge-dash">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </section>

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