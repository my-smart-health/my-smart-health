'use client';

import { RefObject } from "react";
import { MAX_FILES_PER_USER, MAX_IMAGE_SIZE_MB, MAX_IMAGE_SIZE_BYTES } from "@/utils/constants";
import Spinner from "@/components/common/Spinner";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('EditProfileForm');
  return (
    <section>
      <fieldset className={`fieldset mb-5 ${blobResult.length >= MAX_FILES_PER_USER ? 'opacity-50 pointer-events-none' : ''}`}>
        <legend className="fieldset-legend">{t('mediaUpload.legend')}</legend>
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
                setError(t('mediaUpload.maxImagesError', { max: MAX_FILES_PER_USER }));
                e.target.value = "";
                return;
              }
              for (const file of Array.from(files)) {
                if (file.size > MAX_IMAGE_SIZE_BYTES) {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setError(t('mediaUpload.imageTooLarge', { name: file.name, maxMB: MAX_IMAGE_SIZE_MB }));
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
            <span className="label-text-alt text-gray-500">{t('mediaUpload.maxSizeLabel', { maxMB: MAX_IMAGE_SIZE_MB })}</span>
          </div>
          {isDisabled && (
            <div className="mt-2">
              <Spinner size="sm" label={t('mediaUpload.uploadingSpinner')} />
            </div>
          )}
        </div>
      </fieldset>
    </section>
  );
}