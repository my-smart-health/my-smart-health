import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type RatingLinkDisplayProps = {
  ratingLink: string | null;
};

export default function RatingLinkDisplay({ ratingLink }: RatingLinkDisplayProps) {
  if (!ratingLink) return null;

  return (
    <div className="flex flex-wrap gap-2 mr-auto">
      <div className="flex items-center h-auto my-auto">
        <Link
          href={ratingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="badge badge-primary py-6 text-white hover:bg-primary/75 transition-colors duration-200 break-before-left link">
          <span className="mr-1"><ExternalLink /></span>Google Rating
        </Link>
      </div>
    </div>
  );
}