import { Suspense } from "react";

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
  height = 480,
  width = 400,
}: {
  embedHtml: string;
  height?: number | string;
  width?: number | string;
}) {
  const embedUrl = getYoutubeEmbedUrl(embedHtml);

  if (!embedUrl) {
    return (
      <div className="w-full flex justify-center my-4">
        <div className="text-red-500">Invalid YouTube URL</div>
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