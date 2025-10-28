import Image from "next/image";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";

type Props = {
  blobResult: string[];
  setBlobResult: (urls: string[]) => void;
  MEDIA_WIDTH: number;
  MEDIA_HEIGHT: number;
  onAfterDelete?: (updatedBlobs: string[]) => Promise<void> | void;
  onAfterMove?: (updatedBlobs: string[]) => Promise<void> | void;
};

export function ProfileMediaList({
  blobResult,
  setBlobResult,
  MEDIA_WIDTH,
  MEDIA_HEIGHT,
  onAfterDelete,
  onAfterMove
}: Props) {
  return (
    <section>
      <div className="flex flex-col items-center gap-8 w-full max-w-full">
        {blobResult.map((mediaUrl, idx) => {
          const isYoutube = /youtu(be)?/.test(mediaUrl);
          const isInstagram = /instagram/.test(mediaUrl);

          const media = (
            <div
              className={
                isYoutube
                  ? "aspect-video flex items-center justify-center rounded-lg overflow-hidden"
                  : "aspect-square flex items-center justify-center rounded-lg overflow-hidden max-w-[200px]"
              }
            >
              {isYoutube ? (
                <YoutubeEmbed embedHtml={mediaUrl} width={200} height={112} />
              ) : isInstagram ? (
                <InstagramEmbed embedHtml={mediaUrl} width={MEDIA_WIDTH} height={MEDIA_HEIGHT} />
              ) : (
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    src={mediaUrl}
                    alt={`Photo ${idx + 1}`}
                    fill
                    loading="lazy"
                    placeholder="empty"
                    sizes="(max-width: 600px) 100vw, 200px"
                    style={{ objectFit: "contain" }}
                    className="rounded-lg border border-primary hover:scale-150 transition-transform duration-300 ease-in-out"
                  />
                </div>
              )}
            </div>
          );

          return (
            <div
              key={mediaUrl + idx}
              className="flex flex-row items-center justify-center gap-6 w-full"
            >
              {media}
              <div className="flex flex-col items-center gap-2">
                <MoveImageVideo
                  index={idx}
                  blobResult={blobResult}
                  setBlobResultAction={setBlobResult}
                  showTop={idx > 0}
                  showBottom={idx < blobResult.length - 1}
                  removeAddress={`/api/delete/delete-picture?url=${encodeURIComponent(mediaUrl)}`}
                  onAfterDelete={onAfterDelete}
                  onAfterMove={onAfterMove}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}