'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { PutBlobResult } from '@vercel/blob';

import Spinner from '@/components/common/Spinner';
import { useUploadProgress } from '@/components/modals/upload-progress';
import {
  MAX_PROFILE_FILE_SIZE_BYTES,
  MAX_PROFILE_FILE_SIZE_MB,
} from '@/utils/constants';
import Link from 'next/link';
import { Trash2, FileText } from 'lucide-react';

type UploadFilesSectionProps = {
  userId: string;
  profileFiles: string[];
  onFilesUploaded: (uploadedUrls: string[]) => Promise<void>;
  onFileDeleted?: (updatedList: string[]) => Promise<void>;
  setProfileFiles: Dispatch<SetStateAction<string[]>>;
  setError: (message: string | null) => void;
  isDisabled: boolean;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
};

export function UploadFilesSection({
  userId,
  profileFiles,
  onFilesUploaded,
  onFileDeleted,
  setProfileFiles,
  setError,
  isDisabled,
  setIsDisabled,
}: UploadFilesSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { startUpload, updateProgress, finishUpload } = useUploadProgress();

  const getFileNameFromUrl = (fileUrl: string) => {
    try {
      const url = new URL(fileUrl);
      url.searchParams.delete('download');
      const parts = url.pathname.split('/');
      return decodeURIComponent(parts.pop() || fileUrl);
    } catch {
      const stripped = fileUrl.split(/[?#]/)[0];
      return stripped.replace(/^.*[\\/]/, '') || fileUrl;
    }
  };

  const getDownloadUrl = (fileUrl: string) => {
    try {
      const url = new URL(fileUrl);
      url.searchParams.set('download', '1');
      return url.toString();
    } catch {
      const hasQuery = fileUrl.includes('?');
      return fileUrl + (hasQuery ? '&' : '?') + 'download=1';
    }
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const inputEl = event.target;
    const files = inputEl.files;

    if (!files || files.length === 0) {
      setError('Please select at least one file.');
      return;
    }

    if (!userId) {
      setError('Missing user ID. Please reload the page.');
      inputEl.value = '';
      return;
    }

    for (const file of Array.from(files)) {
      if (file.size > MAX_PROFILE_FILE_SIZE_BYTES) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setError(
          `The file "${file.name}" is too large. Maximum allowed is ${MAX_PROFILE_FILE_SIZE_MB}MB.`
        );
        inputEl.value = '';
        return;
      }
    }

    try {
      setUploading(true);
      setIsDisabled(true);

      const uploadedUrls: string[] = [];
      const filesArray = Array.from(files);
      startUpload(filesArray.length);

      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        updateProgress(i, file.name);

        const response = await fetch(
          `/api/upload/upload-profile-file?userid=${encodeURIComponent(
            userId
          )}&filename=${encodeURIComponent(file.name)}`,
          {
            method: 'PUT',
            body: file,
          }
        );

        let payload: unknown = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          finishUpload();
          const errorMessage =
            payload &&
              typeof payload === 'object' &&
              payload !== null &&
              'error' in payload
              ? String((payload as { error?: string }).error)
              : 'File upload failed.';
          throw new Error(errorMessage);
        }

        const blob = payload as PutBlobResult;
        uploadedUrls.push(blob.url);
        updateProgress(i + 1, file.name);
      }

      finishUpload();
      if (uploadedUrls.length > 0) {
        await onFilesUploaded(uploadedUrls);
      }
      setError(null);
    } catch (error) {
      finishUpload();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred while uploading the files.';
      setError(message);
    } finally {
      setUploading(false);
      setIsDisabled(false);
      inputEl.value = '';
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    if (!fileUrl) return;
    try {
      setDeleting(fileUrl);
      setIsDisabled(true);
      const response = await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(fileUrl)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        let msg = 'Failed to delete file';
        try {
          const payload = await response.json();
          if (payload && typeof payload === 'object' && 'message' in payload) {
            msg = String((payload as { message?: string }).message) || msg;
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') console.error(err);
        }
        throw new Error(msg);
      }
      const updated = profileFiles.filter(f => f !== fileUrl);
      setProfileFiles(updated);
      if (onFileDeleted) {
        await onFileDeleted(updated);
      }
      setError(null);
    } catch (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const message = error instanceof Error ? error.message : 'An error occurred while deleting the file.';
      setError(message);
    } finally {
      setDeleting(null);
      setIsDisabled(false);
    }
  };

  return (
    <section>
      <fieldset className="fieldset space-y-4">
        <legend className="fieldset-legend text-base font-semibold">
          Upload files
        </legend>
        <p className="text-sm text-gray-600">
          Upload additional documents for your profile. Each file can be up to {MAX_PROFILE_FILE_SIZE_MB}MB.
        </p>
        <input
          type="file"
          multiple
          className="file-input file-input-bordered file-input-primary w-full"
          disabled={isDisabled}
          onChange={handleUpload}
        />
        <div className="text-xs text-gray-500">
          Supported file types: any document or image format up to {MAX_PROFILE_FILE_SIZE_MB}MB.
        </div>
        {uploading && (
          <div className="pt-2">
            <Spinner size="sm" label="Uploading files..." />
          </div>
        )}
      </fieldset>

      {profileFiles.length > 0 && (
        <section className="mt-6 w-full">
          <h3 className="text-lg font-semibold text-primary mb-3">Uploaded files</h3>
          <div className="flex flex-wrap gap-3">
            {profileFiles.map(fileUrl => {
              const fileName = getFileNameFromUrl(fileUrl);
              return (
                <article key={fileUrl} className="w-full sm:w-auto flex items-start gap-2">
                  <Link
                    href={getDownloadUrl(fileUrl)}
                    download
                    className="badge badge-primary p-2 text-white w-full h-full sm:w-auto hover:bg-primary/75 transition-colors duration-200 break-all whitespace-normal text-left flex items-center gap-2 flex-1 min-w-0"
                  >
                    <FileText size={35} />
                    <span className="break-all  whitespace-normal">{fileName}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label="Delete file"
                    disabled={isDisabled || deleting === fileUrl}
                    onClick={() => handleDeleteFile(fileUrl)}
                    className="btn btn-circle btn-outline btn-error btn-sm sm:btn-md shrink-0 self-center hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}