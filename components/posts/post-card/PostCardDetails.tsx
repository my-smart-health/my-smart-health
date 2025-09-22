'use client'

import Link from "next/link";
import { useState } from "react";
import { Session } from "next-auth";

import { NewsCardType } from "@/utils/types";

import GoBack from "@/components/buttons/go-back/GoBack";
import SeeMoreLess from "@/components/buttons/see-more-less/SeeMoreLess";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import Divider from "@/components/divider/Divider";
import { Pencil, Trash2 } from "lucide-react";
import DeletePostModal from "../delete-post-modal/DeletePostModal";
import { env } from "process";

type PostCardDetailsProps = {
  postData: NewsCardType | null;
  session?: Session | null;
  onDeletePostAction?: (id: string) => void;
}

export default function PostCardDetails({ postData, session, onDeletePostAction }: PostCardDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string>("Möchten Sie diesen Beitrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.");

  if (!postData) return <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No data found</div>;

  const { id, title, content, createdAt, photos, author, tags } = postData as NewsCardType;

  const createdDate = new Date(createdAt ? createdAt : '').toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const handleDeletePost = async () => {
    try {
      if (photos) {
        await Promise.all(photos.map(photoUrl =>
          fetch(`/api/delete/delete-picture?url=${encodeURIComponent(photoUrl)}`, { method: 'DELETE' })
        ));
      }
      const response = await fetch(`/api/delete/delete-post?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      setIsDeleting(false);
      if (onDeletePostAction) onDeletePostAction(id);
    } catch (error) {
      if (env.NODE_ENV === 'development') {
        console.error('Error deleting post:', error);
      }
      setDeleteMessage("Fehler beim Löschen des Beitrags. Bitte versuchen Sie es erneut.");
      setTimeout(() => {
        setIsDeleting(false);
        setDeleteMessage("Möchten Sie diesen Beitrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.");
      }, 3000);
    }
  };

  return (
    <>
      <div
        key={id}
        className="card m-auto min-h-full w-96 border max-w-[99%] rounded-lg shadow-2xl"
      >
        <div className="flex flex-row gap-2 w-full ">
          {title && (
            <span className="text-xl w-full m-5 font-semibold">
              {title}
            </span>
          )}
          <span className="badge text-xl my-5 ml-2 font-semibold ">{createdDate}</span>
        </div>
        <Divider />
        <section>
          <div className="card-body">
            {photos &&
              <FadeCarousel photos={photos} />
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
            <div className="card-actions justify-center w-full">
              <Link
                href={`/profile/${author.id}`}
                className="flex flex-col py-2 w-full max-w-[90%] btn bg-primary rounded-xl text-white text-lg h-fit"
              >
                <div className="w-full">zum Anbieter</div>
                <div className="w-full">{author.name}</div>
              </Link>
            </div>
          }

          {session?.user.role === "ADMIN" || session?.user.id === author?.id
            ? (<div className="space-x-4 self-end mr-5">
              <Link href={`/dashboard/edit-post/${id}`} className="self-center text-lg btn btn-circle btn-warning rounded-xl">
                <Pencil />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsDeleting(true);
                }}
                className="btn btn-circle bg-red-500/90 p-2 cursor-pointer"
              >
                <Trash2 />
              </button>
            </div>)
            : null
          }
        </div>
      </div>
      <div className="flex justify-end my-2">
        <GoBack />
      </div>
      <DeletePostModal
        isOpen={isDeleting}
        onCloseAction={() => { setIsDeleting(false); }}
        onDeleteAction={handleDeletePost}
        message={deleteMessage}
      />
    </>
  );
}