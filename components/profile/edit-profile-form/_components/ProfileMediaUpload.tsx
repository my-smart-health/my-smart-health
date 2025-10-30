import { RefObject } from "react";
import { MAX_FILES_PER_USER, MAX_IMAGE_SIZE_MB, MAX_IMAGE_SIZE_BYTES } from "@/utils/constants";

type Props = {
  blobResult: string[];
  setBlobResult: (urls: string[]) => void;
  setError: (msg: string | null) => void;
  inputFileRef: RefObject<HTMLInputElement | null>;
  handleUploadProfileImages: (files: FileList) => Promise<string[]>;
  isDisabled: boolean;
  onAfterUpload?: (updatedBlobs: string[]) => Promise<void> | void;
};

export function ProfileMediaUpload({
  blobResult,
  setBlobResult,
  setError,
  inputFileRef,
  handleUploadProfileImages,
  isDisabled,
  onAfterUpload,
}: Props) {
  return (
    <section>
      <fieldset className={`fieldset mb-5 ${blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''}`}>
        <legend className="fieldset-legend">Select Images</legend>
        <div className="flex flex-wrap gap-4 w-full">
          <input
            type="file"
            ref={inputFileRef}
            id="image"
            name="image"
            accept="image/*"
            multiple={true}
            className={`${blobResult && blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''} file-input file-input-bordered file-input-primary w-full`}
            disabled={isDisabled}
            onChange={async e => {
              const files = e.target.files;
              if (!files) return;
              if (blobResult.length + files.length > MAX_FILES_PER_USER) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setError(`You can select up to ${MAX_FILES_PER_USER} images only.`);
                e.target.value = "";
                return;
              }
              for (const file of Array.from(files)) {
                if (file.size > MAX_IMAGE_SIZE_BYTES) {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setError(`Image "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`);
                  e.target.value = "";
                  return;
                }
              }
              const uploadedImages = await handleUploadProfileImages(files);
              if (uploadedImages && uploadedImages.length > 0) {
                const newImages = [...blobResult, ...uploadedImages];
                setBlobResult(newImages);
                setError(null);
                if (onAfterUpload) {
                  await onAfterUpload(newImages);
                }
              }
            }}
          />
          <div className="label pt-1">
            <span className="label-text-alt text-gray-500">Maximum image size: {MAX_IMAGE_SIZE_MB}MB per image</span>
          </div>
        </div>
      </fieldset>
    </section>
  );
}