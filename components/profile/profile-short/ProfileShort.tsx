'use client';

import Link from "next/link";
import Image from "next/image";
import ParagraphContent from "@/components/common/ParagraphContent";
import { Membership } from "@/utils/types";
import { MembershipSection } from "../profile-full/_components";

type ProfileShortProps = {
  id: string;
  name: string;
  bio: string;
  image?: string | null;
  membership?: Membership | null;
};

export default function ProfileShort({ id, name, bio, image, membership }: ProfileShortProps) {
  const hasImage = Boolean(image);

  return (
    <div className="card bg-primary/10 border border-primary/40 shadow-sm hover:shadow-md transition-shadow">
      <figure className="w-full h-52 bg-gray-100 flex-shrink-0">
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
            <span className="text-4xl">👤</span>
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title text-primary">
          {name}
        </h2>
        <ParagraphContent content={bio} maxLines={3} className="prose prose-sm" />
        <div className="flex flex-row gap-2 justify-end">
          {membership?.status && (
            <div>
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
    </div>
  );
}