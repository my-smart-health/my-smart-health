'use client';

import Link from "next/link";
import Image from "next/image";
import ParagraphContent from "@/components/common/ParagraphContent";

type ProfileShortProps = {
  id: string;
  name: string;
  bio: string;
  image?: string | null;
};

export default function ProfileShort({ id, name, bio, image }: ProfileShortProps) {
  const hasImage = Boolean(image);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

  return (
    <section className="flex flex-col md:flex-row items-center gap-4 p-4 w-full border rounded-xl bg-white/90 shadow-lg hover:shadow-2xl transition-shadow">
      <div className="flex-shrink-0 flex items-center justify-center w-full md:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden border">
        {hasImage ? (
          <Image
            src={image as string}
            alt={name}
            loading="lazy"
            width={160}
            height={160}
            style={{ objectFit: "cover" }}
            className="rounded-xl w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-3xl font-semibold">
            {initials}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 w-full h-full gap-2">
        <h2 className="font-bold text-xl text-primary mb-1">{name}</h2>
        <div className="w-full flex-1">
          <ParagraphContent content={bio} maxLines={3} className="prose prose-sm" />
        </div>
        <div className="flex justify-end mt-auto">
          <Link
            href={`/profile/${id}`}
            className="btn btn-primary btn-sm rounded-full px-6 font-semibold shadow"
          >
            zum Profil
          </Link>
        </div>
      </div>
    </section>
  );
}