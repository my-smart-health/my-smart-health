'use client'

import Link from "next/link";
import { useState } from "react";
import { Session } from "next-auth";

import { NewsCardType } from "@/utils/types";

import GoBack from "@/components/buttons/go-back/GoBack";
import ParagraphContent from "@/components/common/ParagraphContent";
import FadeCarousel from "@/components/carousels/fade-carousel/FadeCarousel";
import Divider from "@/components/divider/Divider";
import { AtSign, Pencil, Trash2, Globe, Facebook, Linkedin, Youtube, Instagram } from "lucide-react";
import Xlogo from "@/public/x-logo-black.png";
import TikTokLogo from "@/public/tik-tok-logo.png";
import DeletePostModal from "../delete-post-modal/DeletePostModal";
import Image from "next/image";

type PostCardDetailsProps = {
  postData: NewsCardType | null;
  session?: Session | null;
  onDeletePostAction?: (id: string) => void;
}

export default function PostCardDetails({ postData, session, onDeletePostAction }: PostCardDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string>("Möchten Sie diesen Beitrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.");

  if (!postData) return <div className="text-red-500 border rounded-2xl p-2 text-center">Error: No data found</div>;

  const { id, title, content, createdAt, photos, author, tags, socialLinks } = postData as NewsCardType;

  const platformIcons = {
    Email: <AtSign size={18} />,
    Website: <Globe size={18} />,
    Facebook: <Facebook size={18} />,
    Linkedin: <Linkedin size={18} />,
    X: <Image src={Xlogo} alt="X logo" width={18} height={18} />,
    Youtube: <Youtube size={18} />,
    TikTok: <Image src={TikTokLogo} alt="TikTok logo" width={18} height={18} />,
    Instagram: <Instagram size={18} />,
  };

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
      if (process.env.NODE_ENV === 'development') {
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
        className="card m-auto min-h-full w-full max-w-2xl border-2 border-gray-500 rounded-xl shadow-lg bg-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 pb-0">
          {title && (
            <h1 className="text-2xl font-bold text-primary line-clamp-2 break-words flex-1">
              {title}
            </h1>
          )}
          <span className="badge badge-outline badge-lg py-3 px-4 text-sm font-medium whitespace-nowrap">
            {createdDate}
          </span>
        </div>

        <Divider addClass="my-3" />

        <section className="px-4">
          {photos && photos.length > 0 && (
            <div className="mb-4">
              <FadeCarousel photos={photos} />
            </div>
          )}

          {content && (
            <div className="prose prose-sm max-w-none mb-4">
              <ParagraphContent content={content} />
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="mb-4">
              <Divider addClass="mb-3" />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="badge badge-dash badge-sm py-2 px-3">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {socialLinks && socialLinks.length > 0 && (
            <div className="mb-4">
              <Divider addClass="mb-3" />
              <h3 className="text-base font-semibold text-primary mb-2">Links</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {socialLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-primary gap-1 p-3 hover:bg-primary/80 transition-colors text-white text-xs"
                  >
                    {platformIcons[link.platform as keyof typeof platformIcons]}
                    <span className="truncate">{link.platform}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-3 p-4 pt-0">
          <Divider addClass="mb-2" />

          <div className="flex items-center justify-between gap-3">
            {author?.name && (
              <Link
                href={`/profile/${author.id}`}
                className="btn btn-primary btn-sm rounded-full px-6 text-white flex-1 sm:flex-none"
              >
                {author.name}
              </Link>
            )}

            {(session?.user.role === "ADMIN" || session?.user.id === author?.id) && (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/edit-post/${id}`}
                  className="btn btn-warning btn-sm btn-circle"
                >
                  <Pencil size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="btn btn-error btn-sm btn-circle"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <GoBack />
      </div>

      <DeletePostModal
        isOpen={isDeleting}
        onCloseAction={() => setIsDeleting(false)}
        onDeleteAction={handleDeletePost}
        message={deleteMessage}
      />
    </>
  );
}