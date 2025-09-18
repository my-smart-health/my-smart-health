import Divider from "@/components/divider/Divider";
import { MAX_FILES_PER_USER } from "@/utils/constants";
import React from "react";

type MediaUrlSectionProps = {
  blobResult: string[];
  setError: (msg: string | null) => void;
  setBlobResult: (urls: string[]) => void;
  handleAddURL: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function MediaUrlSection({
  blobResult,
  setError,
  setBlobResult,
  handleAddURL,
}: MediaUrlSectionProps) {
  return (
    <section>
      <fieldset className={blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''}>
        <legend className="fieldset-legend">Add Media URL</legend>
        <div className="flex flex-col gap-4 w-full">
          <label htmlFor="media" className="">
            Media URL must be a valid URL from YouTube or Instagram
          </label>
          <input
            type="text"
            name="media"
            placeholder="https://"
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />

          <button
            type="button"
            onClick={handleAddURL}
            className="btn btn-outline btn-primary w-full mt-2"
          >
            Upload Media URL
          </button>

          <Divider addClass="my-2" />

          <div className="flex flex-wrap max-w-[50%] gap-4 text-wrap mx-auto">
            {blobResult && blobResult.length > 0 && (
              <>
                <div className="text-sm">
                  You can add up to {MAX_FILES_PER_USER} media files (images, Instagram videos, or YouTube videos)
                </div>
                <p className="text-wrap text-warning">
                  NB: Please ensure that the first media is image.
                </p>
              </>
            )}
          </div>
        </div>
      </fieldset>
    </section>
  );
}