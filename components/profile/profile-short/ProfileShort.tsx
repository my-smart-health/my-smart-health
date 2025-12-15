'use client';

import Link from "next/link";
import Image from "next/image";
import ParagraphContent from "@/components/common/ParagraphContent";
import { Membership } from "@/utils/types";
import { MembershipSection } from "../profile-full/_components";
import RatingStars from "@/components/common/RatingStars";
import { Image as ImageIcon } from "lucide-react";

type ProfileShortProps = {
  id: string;
  name: string;
  bio: string;
  image?: string | null;
  membership?: Membership | null;
  ratingStars?: number | null;
  ratingLink?: string | null;
};

export default function ProfileShort({ id, name, bio, image, membership, ratingStars, ratingLink }: ProfileShortProps) {
  const hasImage = Boolean(image);

  return (
    <div className="card bg-primary/10 border border-primary/40 shadow-sm hover:shadow-md transition-shadow">
      <figure className="w-full h-52 bg-gray-100 flex-shrink-0 mt-3">
        {hasImage ? (
          <Image
            src={image as string}
            alt={name}
            loading="lazy"
            width={256}
            height={256}
            className="object-contain my-auto w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl border p-36"><ImageIcon /></span>
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title text-primary">
          {name}
        </h2>
        <ParagraphContent content={bio} maxLines={3} className="prose prose-sm" />
        <div className="flex flex-col mr-auto">
          {ratingStars !== null && ratingStars !== undefined && (
            <RatingStars id={id} stars={ratingStars} ratingLink={ratingLink} />
          )}
        </div>
        <div className="flex flex-row gap-2 justify-end">
          {membership?.status && (
            <div className="mr-auto">
              <MembershipSection membership={membership} />
            </div>
          )}

          <Link
            href={`/profile/${id}`}
            className="btn btn-primary my-auto"
          >
            zum Profil
          </Link>
        </div>
      </div>
    </div >
  );
}