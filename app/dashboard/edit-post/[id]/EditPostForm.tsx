"use client"

import Image from "next/image";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { PutBlobResult } from "@vercel/blob";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

import logo from "@/public/og-logo.jpg";
import { ArrowUpRight, XIcon } from "lucide-react";

import { MAX_FILES_PER_POST } from "@/utils/constants";
import GoBack from "@/components/buttons/go-back/GoBack";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";

type EditPostFormProps = {
  session: Session | null;
  post: {
    id: string;
    title: string;
    content: string;
    photos: string[];
    tags: string[];
  };
};

export default function EditPostForm({ session, post }: EditPostFormProps) {

  if (!session) {
    redirect('/login');
  }

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>(post.tags || []);

  const [isDefaultLogo, setIsDefaultLogo] = useState<boolean>(false);

  const [blobResult, setBlobResult] = useState<string[]>(post.photos || []);

  const [isImageFirst, setIsImageFirst] = useState<boolean>(true);

  useEffect(() => {
    if (blobResult.length > 0) {
      setIsImageFirst(
        blobResult[0].search("instagram") === -1 &&
        blobResult[0].search("youtube") === -1 &&
        blobResult[0].search("youtu") === -1
      );
    }
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

    setError(null);
    setBlobResult([...blobResult, mediaUrl]);
    const resetMediaInput = form.querySelector('input[name="media"]') as HTMLInputElement;
    resetMediaInput.value = '';
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!file) {
        return;
      }

      setIsDisabled(true);
      const response = await fetch(
        `/api/upload-picture/?userid=${session.user.id}&filename=${file.name}`,
        {
          method: 'PUT',
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

        const response = await fetch(logo.src);
        if (!response.ok) {
          throw new Error('Failed to fetch default logo');
        }

        const blob = await response.blob();
        const file = new File([blob], "og-logo.jpg", { type: blob.type });

        const uploadedUrl = await handleImageUpload(file);

        blobResult.push(uploadedUrl as string);
      }

      if (!isImageFirst) {
        setError("First media must be an image");
        setIsDisabled(false);
        return;
      }
      setError(null);

      const result = await fetch(`/api/update-post`, {
        method: 'PUT',
        body: JSON.stringify({
          id: post.id,
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
        setError('Failed to update post');
        setIsDisabled(false);
        return;
      }
      setError("Post updated successfully");
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
      {error && <p className={`${error === 'Post updated successfully' ? 'text-green-500' : 'text-red-500'} bg-secondary/10 border-2 border-primary rounded-2xl p-2 text-center break-all`}>{error}</p>}
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
            defaultValue={post.title}
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
            defaultValue={post.content}
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
          <fieldset className="fieldset mb-5">
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

          <fieldset>
            <legend className="fieldset-legend">Add Media URL</legend>
            <div className="flex flex-col gap-4 w-full">
              <label htmlFor={`media`} className="">Media URL must be a valid URL from YouTube or Instagram</label>
              <input
                type="text"
                name={`media`}
                placeholder="https://"
                className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
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
            const media = image.includes("youtube") || image.includes("youtu")
              ? <YoutubeEmbed embedHtml={image} width={200} height={200} />
              : image.includes("instagram")
                ? <InstagramEmbed embedHtml={image} width={200} height={200} />
                : <Image
                  src={image}
                  alt={`Photo ${idx + 1}`}
                  width={200}
                  height={200}
                  placeholder="empty"
                  className="object-cover rounded-lg w-[200px] h-[200px] hover:z-10 hover:scale-200 hover:shadow-lg cursor-pointer transition-all"
                />;

            return (
              <div
                key={image + idx}
                className="flex w-full justify-center items-center gap-4 max-w-[90%]"
                style={{ minHeight: 200 }}
              >
                <div className="flex items-center justify-center w-[200px] h-[200px]">
                  {media}
                </div>
                <div className="flex flex-col items-center justify-center h-[200px] gap-2">
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
            <p className="text-wrap text-warning">NB: Please ensure that the first media is image.</p>
          </div>
        )}

        <button type="submit" className={`p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors ${isImageFirst ? '' : 'opacity-50 pointer-events-none'}`}>
          Update Post
        </button>
      </form >
    </>
  );
}
