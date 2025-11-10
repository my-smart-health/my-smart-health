"use client";

import { Suspense } from "react";
import { useCookieConsent } from "@/lib/useCookieConsent";
import { Youtube } from "lucide-react";

//  Usage
//  <YoutubeEmbed embedHtml="https://www.youtube.com/watch?v=dQw4w9WgXcQ" height={240} width={320} />
//  <YoutubeEmbed embedHtml="https://www.youtube.com/shorts/dQw4w9WgXcQ" height={240} width={320} />
//  <YoutubeEmbed embedHtml="https://youtu.be/dQw4w9WgXcQ" height={240} width={320} />
//  <YoutubeEmbed embedHtml="https://youtu.be/9bZkp7q19f0" height={240} width={320} />

const getYoutubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/);
  const shortsVideo = url.match(/youtube\.com\/shorts\/([^&\n]{11})/);

  const shortMatch = url.match(/youtu\.be\/([^&\n]{11})/);
  const shortShortsVideo = url.match(/youtu\.be\/shorts\/([^&\n]{11})/);

  if (videoIdMatch) return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (shortsVideo) return `https://www.youtube.com/embed/${shortsVideo[1]}`;
  if (shortShortsVideo) return `https://www.youtube.com/embed/${shortShortsVideo[1]}`;
  return "";
};

export default function YoutubeEmbed({
  embedHtml,
  height = "480px",
  width = "400px",
}: {
  embedHtml: string;
  height?: number | string;
  width?: number | string;
}) {
  const { socialMedia } = useCookieConsent();
  const embedUrl = getYoutubeEmbedUrl(embedHtml);

  if (!embedUrl) {
    return (
      <div className="w-full flex justify-center my-4">
        <div className="text-red-500">Invalid YouTube URL</div>
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
          <Youtube className="w-12 h-12 text-gray-400" />
          <div className="text-sm text-gray-700 max-w-xs">
            <p className="font-semibold mb-2">YouTube-Video blockiert</p>
            <p className="text-xs">
              Bitte akzeptieren Sie Social Media Cookies in den{" "}
              <button
                onClick={() => window.dispatchEvent(new Event("msh:cookie:open"))}
                className="link link-primary underline font-medium"
              >
                Cookie-Einstellungen
              </button>
              , um dieses Video anzuzeigen.
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
          title="YouTube Embed"
          allowFullScreen
          frameBorder="0"
          className="rounded-lg aspect-video object-cover bg-white"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </Suspense>
  );
}