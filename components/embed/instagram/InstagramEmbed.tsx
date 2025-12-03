'use client'

import { Suspense } from "react";
import { useCookieConsent } from "@/lib/useCookieConsent";
import { Instagram } from "lucide-react";

function getInstagramEmbedUrl(url: string) {
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
  height = "480px",
  width = "400px",
}: {
  embedHtml: string;
  height?: number | string;
  width?: number | string;
}) {
  const { socialMedia } = useCookieConsent();
  const embedUrl = getInstagramEmbedUrl(embedHtml);

  if (!embedUrl) {
    return (
      <div className="w-full flex justify-center my-4">
        <div className="text-red-500">Invalid Instagram URL</div>
      </div>
    );
  }

  if (!socialMedia) {
    return (
      <div className="w-full flex justify-center my-4">
        <div
          className="bg-gray-100 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 p-6 text-center"
          style={{ width, height }}
        >
          <Instagram className="w-12 h-12 text-gray-400" />
          <div className="text-sm text-gray-700 max-w-xs">
            <p className="font-semibold mb-2">Instagram-Inhalt blockiert</p>
            <p className="text-xs">
              Bitte akzeptieren Sie Social Media Cookies in den{" "}
              <button
                onClick={() => window.dispatchEvent(new Event("msh:cookie:open"))}
                className="link link-primary underline font-medium"
              >
                Cookie-Einstellungen
              </button>
              , um diesen Inhalt anzuzeigen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className={`skeleton animate-pulse h-[${height}] w-[${width}] bg-gray-200 rounded-lg`}
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
          loading="lazy"
          className="rounded-lg bg-white"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </Suspense>
  );
}