import { ChangeEvent, RefObject } from "react";
import { MAX_FILES_PER_USER } from "@/utils/constants";

type Props = {
  blobResult: string[];
  setBlobResult: (urls: string[]) => void;
  setError: (msg: string | null) => void;
  inputFileRef: RefObject<HTMLInputElement | null>;
  handleUploadProfileImages: (files: FileList) => Promise<string[]>;
  isDisabled: boolean;
};

export function ProfileMediaUpload({
  blobResult,
  setBlobResult,
  setError,
  inputFileRef,
  handleUploadProfileImages,
  isDisabled,
}: Props) {
  return (
    <section>
      <fieldset className={`fieldset mb-5 ${blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''}`}>
        <legend className="fieldset-legend">Select File</legend>
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
                setError(`You can select up to ${MAX_FILES_PER_USER} files only.`);
                e.target.value = "";
                return;
              }
              const uploadedImages = await handleUploadProfileImages(files);
              setBlobResult([...blobResult, ...uploadedImages]);
              setError(null);
            }}
          />
        </div>
      </fieldset>
    </section>
  );
}