'use client'

import { Suspense } from "react";

function getInstagramEmbedUrl(url: string) {
  // Match /reel/ID or /p/ID
  const reelMatch = url.match(/\/reel\/([^/?]+)/);
  const reelsMatch = url.match(/\/reels\/([^/?]+)/);
  const postMatch = url.match(/\/p\/([^/?]+)/);
  if (reelMatch) return `https://www.instagram.com/reel/${reelMatch[1]}/embed`;
  if (reelsMatch) return `https://www.instagram.com/reel/${reelsMatch[1]}/embed`;
  if (postMatch) return `https://www.instagram.com/p/${postMatch[1]}/embed`;
  return "";
}

export default function InstagramEmbed({
  embedHtml,
  height = 480,
  width = 400,
}: {
  embedHtml: string;
  height?: number | string;
  width?: number | string;
}) {
  const embedUrl = getInstagramEmbedUrl(embedHtml);

  if (!embedUrl) {
    return (
      <div className="w-full flex justify-center my-4">
        <div className="text-red-500">Invalid Instagram URL</div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className={`skeleton animate-pulse h-[${height}px] w-[${width}px] bg-gray-200 rounded-lg`}
        ></div>
      }
    >
      <div className="w-full flex justify-center my-4">
        <iframe
          src={embedUrl}
          width={width}
          height={height}
          allow="autoplay; encrypted-media"
          title="Instagram Embed"
          frameBorder="0"
          className="rounded-lg bg-white"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </Suspense>
  );
}