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

  return (
    <section className="flex flex-row items-start gap-3 p-3 w-full border rounded-lg bg-white/90 shadow hover:shadow-md transition-shadow">
      {hasImage && (
        <div className="flex-shrink-0 mt-1 flex items-center justify-center w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
          <Image
            src={image as string}
            alt={name}
            loading="lazy"
            width={80}
            height={80}
            style={{ objectFit: "cover" }}
            className="rounded-lg w-full h-full"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <h2 className="font-bold text-lg text-primary leading-tight">{name}</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex-1 min-w-0 border rounded border-primary px-2 py-1">
            <ParagraphContent content={bio} maxLines={2} className="prose prose-sm text-sm leading-snug" />
          </div>
          <Link
            href={`/profile/${id}`}
            className="btn btn-primary rounded-full px-4 font-semibold text-xs flex-shrink-0"
          >
            zum Profil
          </Link>
        </div>
      </div>
    </section>
  );
}