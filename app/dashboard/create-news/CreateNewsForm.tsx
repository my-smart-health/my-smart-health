"use client"

import GoToButton from "@/components/buttons/go-to/GoToButton";
import { PutBlobResult } from "@vercel/blob";
import { ArrowUpRight } from "lucide-react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import logo from '@/public/logo.png'

type CreateNewsFormProps = {
  session: Session | null;
};

export default function CreateNewsForm({ session }: CreateNewsFormProps) {

  if (!session) {
    redirect('/login');
  }

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDefaultLogo, setIsDefaultLogo] = useState<boolean>(false);
  const blobResult: string[] = [];
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsDisabled(true);
      const formData = new FormData(event.currentTarget);

      let files: File[];
      if (!inputFileRef.current?.files || inputFileRef.current.files.length === 0) {
        setIsDefaultLogo(true);
        const response = await fetch(logo.src);
        const blob = await response.blob();
        const defaultFile = new File([blob], "logo.png", { type: blob.type });
        files = [defaultFile];
      } else {
        files = Array.from(inputFileRef.current.files);
        setIsDefaultLogo(false);
      }

      if (files.some(file => file.size > 4 * 1024 * 1024)) { // 4MB limit
        setError(`File ${files.find(file => file.size > 4 * 1024 * 1024)?.name} exceeds the 4MB size limit.`);
        setIsDisabled(false);
        return;
      }

      for (const file of files) {
        if (files.length > 10) {
          setError("You can upload up to 10 files only.");
          setIsDisabled(false);
          return;
        }

        const uniqueFileName = `${Date.now()}-${file.name}`;
        const response = await fetch(
          `/api/upload-picture/?userid=${session.user.id}&filename=${uniqueFileName}`,
          {
            method: 'POST',
            body: file,
          }
        );
        const result = await response.json() as PutBlobResult;
        blobResult.push(result.url);
      }

      const result = await fetch(`/api/create-news`, {
        method: 'POST',
        body: JSON.stringify({
          authorId: session.user.id,
          title: formData.get('title'),
          content: formData.get('content'),
          photos: blobResult,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!result.ok) {
        setError('Failed to create news');
        setIsDisabled(false);
        return;
      }

      setError("News created successfully");
      setIsDisabled(true);
    } catch (error) {
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      setIsDisabled(false);
      return;
    }
  };

  return (
    <>
      {error && <p className={`${error === 'News created successfully' ? 'text-green-500' : 'text-red-500'} bg-secondary/10 border-2 border-primary rounded-2xl p-2 text-center break-all`}>{error}</p>}
      {isDefaultLogo && <div className="flex flex-col items-center">
        <p className="text-yellow-500 bg-secondary/10 border-2 border-primary rounded-2xl p-2 text-center break-all">
          No image file was selected, default logo will be used
        </p>
        <p className="text-sm text-gray-500 italic">
          You can change it later in the edit news section
        </p>
      </div>}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <fieldset className="fieldset text-lg">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </fieldset>
        <fieldset className="fieldset">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
            <textarea
              id="content"
              name="content"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            <div className="label text-xs">You can pull the arrow on the right to resize <ArrowUpRight /></div>
          </label>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend ">Pick a file</legend>
          <input
            type="file"
            ref={inputFileRef}
            id="image"
            name="image"
            accept="image/*"
            multiple
            className="file-input"
          />
          <div className="label text-xs">You can upload up to 10 files</div>
          <label htmlFor="image" className="label">Max file size 4MB</label>
        </fieldset>
        <button type="submit" className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors">
          Create News
        </button>
      </form>
      <div className="text-xl">
        {isDisabled && <GoToButton src="/dashboard" name="Back to Dashboard" />}
      </div>

    </>
  );
}
