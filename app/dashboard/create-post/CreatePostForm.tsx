"use client"

import Image from "next/image";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { PutBlobResult } from "@vercel/blob";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { MAX_FILES_PER_POST } from "@/utils/constants";
import GoBack from "@/components/buttons/go-back/GoBack";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";

import logo from '@/public/og-logo.jpg';
import { ArrowUpRight, XIcon } from "lucide-react";

type CreatePostFormProps = {
  session: Session | null;
};

export default function CreatePostForm({ session }: CreatePostFormProps) {

  if (!session) {
    redirect('/login');
  }

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDefaultLogo, setIsDefaultLogo] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>([]);

  const [blobResult, setBlobResult] = useState<string[]>([]);

  const [isImageFirst, setIsImageFirst] = useState<boolean>(true);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (blobResult.length > 0) {
      setIsImageFirst(
        blobResult[0].search("instagram") === -1 &&
        blobResult[0].search("youtube") === -1 &&
        blobResult[0].search("youtu") === -1
      );
    }

    return () => {
      if (isSubmitted === false) {
        (async () => {
          await Promise.all(
            blobResult.map((url) =>
              fetch(`/api/remove-picture?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
            )
          );
        })();
      }
    };
  }, [blobResult]);

  const handleAddURL = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);
    const mediaUrl = formData.get(`media`)?.toString().trim();

    if (!mediaUrl || mediaUrl.length === 0) {
      setError('Media URL cannot be empty');
      return;
    }
    if (
      (mediaUrl.includes("youtube") || mediaUrl.includes("youtu")) ||
      mediaUrl.includes("instagram")
    ) {
      setError(null);
      setBlobResult([...blobResult, mediaUrl]);
      const resetMediaInput = form.querySelector('input[name="media"]') as HTMLInputElement;
      resetMediaInput.value = '';
    } else {
      setError('Media URL must be a valid YouTube or Instagram link');
      return;
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (file === undefined) {
        setIsDefaultLogo(true);
        return logo.src;
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

      if (!response.ok) {
        setError('Failed to upload image');
        setIsDisabled(false);
        throw new Error('Failed to upload image');
      }

      return result.url;
    } catch (error) {
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      setIsDisabled(false);
      return logo.src;
    }
  };

  const handleAddTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTags([...tags, '']);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newTags = [...tags];
    newTags[index] = e.target.value;
    setTags(newTags);
  };

  const handleRemoveTag = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      event.preventDefault();
      setIsDisabled(true);
      const formData = new FormData(event.currentTarget);

      if (blobResult.length === 0) {
        setIsDefaultLogo(true);
        blobResult.push(logo.src);
      }

      if (!isImageFirst) {
        setError("First media must be an image");
        setIsDisabled(false);
        return;
      }
      setError(null);

      const result = await fetch(`/api/create-post`, {
        method: 'POST',
        body: JSON.stringify({
          authorId: session.user.id,
          title: formData.get('title'),
          content: formData.get('content'),
          photos: blobResult,
          tags: tags.filter(tag => tag.trim() !== ''),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!result.ok) {
        setError('Failed to create post');
        setIsDisabled(false);
        return;
      }

      setIsSubmitted(true);
      setError("Post created successfully");
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
      <span className="self-end mb-4">
        <GoBack />
      </span>
      {error && <p className={`${error === 'Post created successfully' ? 'text-green-500' : 'text-red-500'} bg-secondary/10 border-2 border-primary rounded-2xl p-2 text-center break-all`}>{error}</p>}
      {isDefaultLogo && <div className="flex flex-col items-center">
        <p className="text-yellow-500 bg-secondary/10 border-2 border-primary rounded-2xl p-2 text-center break-all">
          No image file was selected, default logo will be used
        </p>
        <p className="text-sm text-gray-500 italic">
          You can change it later in the edit post section
        </p>
      </div>}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>

        <fieldset className="fieldset text-lg">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <textarea
            id="title"
            name="title"
            required
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
          <div className="label pt-1 text-xs flex flex-row justify-end">You can pull the right corner to resize it <ArrowUpRight /></div>
        </fieldset>

        <div className="w-full mx-auto border border-primary h-0"></div>

        <fieldset className="fieldset">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
          <div className="label pt-1 text-xs flex flex-row justify-end">You can pull the right corner to resize it <ArrowUpRight /></div>
        </fieldset>

        <div className="w-full mx-auto border border-primary h-0"></div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Post Tags</legend>
          {tags.length > 0 && (
            <div className="flex flex-col flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <input
                    type="text"
                    name={`tag-${index}`}
                    placeholder="Tag"
                    value={tags[index]}
                    onChange={(e) => handleTagsChange(e, index)}
                    className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  />
                  {tags[index] && (
                    <div key={index} className="flex items-center bg-primary text-white px-3 py-1 rounded-full">
                      <span>{tag}</span>
                      <button type="button" onClick={(e) => handleRemoveTag(e, index)} className="ml-2">
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={handleAddTag} className="btn btn-primary mt-2">Add Tag</button>
        </fieldset>

        <div className="w-full mx-auto border border-primary h-0"></div>

        <div className={blobResult.length >= MAX_FILES_PER_POST ? 'opacity-50 pointer-events-none' : ''}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Select File</legend>
            <div className="flex flex-wrap gap-4 w-full">
              <input
                type="file"
                ref={inputFileRef}
                id="image"
                name="image"
                accept="image/*"
                className={`${blobResult && blobResult.length >= MAX_FILES_PER_POST ? 'opacity-50 pointer-events-none' : ''} file-input file-input-bordered file-input-primary w-full max-w-xs`}
                onChange={async e => {
                  if (e.target.files && e.target.files.length > MAX_FILES_PER_POST) {
                    setError(`You can select up to ${MAX_FILES_PER_POST} files only.`);
                    e.target.value = "";
                  } else {
                    inputFileRef.current = e.target;
                    const uploadedImage = await handleImageUpload(e.target.files?.[0] as File);
                    setBlobResult(prev => [...prev, uploadedImage as string]);
                    setError(null);
                  }
                }} />
            </div>
          </fieldset>

          <div className="w-full my-5 mx-auto border border-primary h-0"></div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Add Media URL</legend>
            <div className="flex flex-col gap-4 w-full">
              <input
                type="text"
                name={`media`}
                placeholder="https://"
                className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <label htmlFor={`media`} className="">Media URL must be a valid URL from YouTube or Instagram</label>
              <button
                type="button"
                onClick={(e) => {
                  handleAddURL(e)
                }}
                className="btn w-full btn-primary mt-2"
              >
                Upload Media URL
              </button>
            </div>
          </fieldset>
        </div>

        <div className="w-full mx-auto border border-primary h-0"></div>

        <div className="flex flex-col self-center w-full max-w-[90%] gap-4">
          {blobResult && blobResult.map((image, idx) => {
            const WIDTH = 200;
            const HEIGHT = 200;
            const media = image.includes("youtube") || image.includes("youtu")
              ? <YoutubeEmbed embedHtml={image} width={WIDTH} height={HEIGHT} />
              : image.includes("instagram")
                ? <InstagramEmbed embedHtml={image} width={WIDTH} height={HEIGHT} />
                : <Image
                  src={image}
                  alt={`Photo ${idx + 1}`}
                  width={WIDTH}
                  height={HEIGHT}
                  placeholder="empty"
                  className={`object-cover rounded-lg w-[${WIDTH}px] h-[${HEIGHT}px] hover:z-10 hover:scale-200 hover:shadow-lg cursor-pointer transition-all`}
                />;

            return (
              <div
                key={image + idx}
                className="flex w-full justify-center items-center gap-4 max-w-[90%]"
                style={{ minHeight: 200 }}
              >
                <div className={`flex items-center justify-center w-[${WIDTH}px] h-[${HEIGHT}px]`}>
                  {media}
                </div>
                <div className={`flex flex-col items-center justify-center h-[${HEIGHT}px] gap-2`}>
                  <MoveImageVideo
                    index={idx}
                    blobResult={blobResult}
                    setBlobResultAction={setBlobResult}
                    showTop={idx > 0}
                    showBottom={idx < blobResult.length - 1}
                    removeAddress={`/api/remove-picture?url=${encodeURIComponent(image)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {blobResult && blobResult.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm">You can add up to {MAX_FILES_PER_POST} media files (images, Instagram videos, or YouTube videos)</div>
            <p className="text-wrap text-warning">NB: Please ensure that the first media is an image.</p>
          </div>
        )}

        <button type="submit" className={`p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors ${isImageFirst ? '' : 'opacity-50 pointer-events-none'}`}>
          Create Post
        </button>
      </form >
    </>
  );
}
