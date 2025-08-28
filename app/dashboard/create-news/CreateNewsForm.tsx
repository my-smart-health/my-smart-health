"use client"

import GoToButton from "@/components/buttons/go-to/GoToButton";
import { PutBlobResult } from "@vercel/blob";
import { ArrowUpRight } from "lucide-react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { FormEvent, useRef, useState } from "react";

type CreateNewsFormProps = {
  session: Session | null;
};

export default function CreateNewsForm({ session }: CreateNewsFormProps) {

  if (!session) {
    redirect('/login');
  }

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsDisabled(true);
      const formData = new FormData(event.currentTarget);

      if (!inputFileRef.current?.files) {
        setError("No file selected");
      } else {
        const files = inputFileRef.current.files.length > 0 ? Array.from(inputFileRef.current.files) : [];

        if (files.some(file => file.size > 4 * 1024 * 1024)) { // 4MB limit
          setError(`File ${files.find(file => file.size > 4 * 1024 * 1024)?.name} exceeds the 4MB size limit.`);
          return;
        }

        for (const file of files) {
          if (files.length > 10) {
            setError("You can upload up to 10 files only.");
            return;
          }
          const response = await fetch(
            `/api/upload-picture/${session.user.id}?filename=${file.name}`,
            {
              method: 'POST',
              body: file,
            }
          );
          const result = await response.json() as PutBlobResult;

          setBlob((prev) => [...(prev || []), result]);
        }
      }
      const result = await fetch(`/api/create-news`, {
        method: 'POST',
        body: JSON.stringify({
          authorId: session.user.id,
          title: formData.get('title'),
          content: formData.get('content'),
          photos: blob.map(b => b.pathname),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!result.ok) {
        setError('Failed to create news');
        return NextResponse.error();
      }

      setError("News created successfully");

      return NextResponse.json({ message: 'News created successfully' });
    } catch (error) {
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      setIsDisabled(false);
      return NextResponse.error();
    }
  };
  return (
    <>
      {error && <p className={`${error === 'News created successfully' ? 'text-green-500' : 'text-red-500'} bg-secondary/10 border-2 border-primary rounded-2xl p-2 text-center`}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div>
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
        </div>
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
            required
            className="file-input"
          />
          <div className="label text-xs">You can upload up to 10 files</div>
          <label htmlFor="image" className="label">Max file size 4MB</label>
        </fieldset>
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Create News
        </button>
      </form>
      <div className="text-xl">
        {isDisabled && <GoToButton src="/dashboard" name="Back to Dashboard" />}
      </div>

    </>
  );
}
