"use client"

import Image from "next/image";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { PutBlobResult } from "@vercel/blob";
import { FormEvent, MouseEvent, useRef, useEffect, useState } from "react";

import logo from "@/public/og-logo-blue.jpg";
import { ArrowUpRight, XIcon } from "lucide-react";

import { MAX_FILES_PER_POST } from "@/utils/constants";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";
import Divider from "@/components/divider/Divider";

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
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");

  const [isDefaultLogo, setIsDefaultLogo] = useState<boolean>(false);

  const [blobResult, setBlobResult] = useState<string[]>(post.photos || []);

  const [isImageFirst, setIsImageFirst] = useState<boolean>(true);

  const errorModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (blobResult.length > 0) {
      setIsImageFirst(
        blobResult[0].search("instagram") === -1 &&
        blobResult[0].search("youtube") === -1 &&
        blobResult[0].search("youtu") === -1
      );
    }
  }, [blobResult]);

  useEffect(() => {
    const resize = (el: HTMLTextAreaElement | null, value: string) => {
      if (el) {
        el.style.height = "auto";
        if (value) el.style.height = el.scrollHeight + "px";
      }
    };
    resize(titleRef.current, title);
    resize(contentRef.current, content);
  }, [title, content]);

  useEffect(() => {
    if (error) {
      errorModalRef.current?.showModal();
    }
  }, [error]);

  const handleErrorClose = () => {
    setError(null);
    errorModalRef.current?.close();
  };

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
        `/api/upload/upload-picture/?userid=${session.user.id}&filename=${file.name}`,
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
      setIsDisabled(false);
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
        const file = new File([blob], "og-logo-blue.jpg", { type: blob.type });

        const uploadedUrl = await handleImageUpload(file);

        blobResult.push(uploadedUrl as string);
      }

      if (!isImageFirst) {
        setError("First media must be an image");
        setIsDisabled(false);
        return;
      }
      setError(null);

      const result = await fetch(`/api/update/update-post`, {
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

      setTimeout(() => {
        redirect(`/news/${post.id}`);
      }, 1500);
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

  const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    e.preventDefault();
    try {
      setIsDisabled(true);
      for (const photoUrl of blobResult) {
        await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(photoUrl)}`, {
          method: 'DELETE',
        });
      }

      const result = await fetch(`/api/delete/delete-post?id=${postId}`, {
        method: 'DELETE',
      });

      if (!result.ok) {
        throw new Error('Failed to delete post');
      }

      setError('Post deleted successfully');

      setTimeout(() => {
        redirect(`/profile/${session.user.id}/news`);
      }, 1500);

    } catch (error) {
      let message = 'Error deleting post';
      if (error instanceof Error) {
        message = error.message;
        console.error(message);
      }
      setError(message);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      {error && (
        <dialog
          ref={errorModalRef}
          id="edit_post_error_modal"
          className="modal modal-bottom backdrop-grayscale-100 transition-all ease-linear duration-500"
          style={{ backgroundColor: 'transparent' }}
          onClose={handleErrorClose}
        >
          <div
            className="modal-box bg-red-500 text-white rounded-2xl w-[95%]"
            style={{
              width: "80vw",
              maxWidth: "80vw",
              margin: '2rem auto',
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              minHeight: "unset",
              padding: "2rem 1.5rem"
            }}
          >
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
                onClick={handleErrorClose}
                type="button"
              >✕</button>
            </form>
            <h3 className="font-bold text-lg">Fehler</h3>
            <p className="py-4 text-center">{error}</p>
          </div>
        </dialog>
      )}

      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="py-4">Are you sure you want to delete this post? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog" className="space-x-4">
              <button
                type="button"
                className="btn btn-outline btn-error hover:text-white hover:bg-error/80 transition-colors p-2 rounded font-bold text-base"
                onClick={(e) => { handleDeletePost(e, post.id) }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-outline btn-primary hover:text-white hover:bg-primary/80 transition-colors p-2 rounded font-bold text-base"
                onClick={(e) => {
                  e.preventDefault();
                  const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
                  if (modal) {
                    modal.close();
                  }
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

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
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            rows={title ? 1 : 3}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
            style={{ overflow: "hidden" }}
          />
          <div className="label pt-1 text-xs flex flex-row justify-end">
            You can pull the right corner to resize it <ArrowUpRight />
          </div>
        </fieldset>

        <Divider />

        <fieldset className="fieldset">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            ref={contentRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={content ? 1 : 3}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
            style={{ overflow: "hidden" }}
          />
          <div className="label pt-1 text-xs flex flex-row justify-end">
            You can pull the right corner to resize it <ArrowUpRight />
          </div>
        </fieldset>

        <Divider />

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

        <Divider />

        <div className={blobResult.length >= MAX_FILES_PER_POST ? 'opacity-50 pointer-events-none' : ''}>
          <fieldset>
            <legend className="fieldset-legend text-base">Add Media URL</legend>
            <div className="flex flex-col gap-4 text-base  w-full">
              <label htmlFor={`media`} className="">Media URL must be a valid URL from YouTube or Instagram</label>
              <input
                type="text"
                name={`media`}
                placeholder="https://"
                className="p-3 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full"
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

          <Divider />

          <fieldset className="fieldset mb-5 w-full">
            <legend className="fieldset-legend text-base">Select Image Files</legend>
            <div className="flex flex-wrap gap-4 w-full">
              <label htmlFor="image" className="">The image file must be a valid image format</label>
              <input
                type="file"
                ref={inputFileRef}
                id="image"
                name="image"
                accept="image/*"
                multiple
                className={`${blobResult && blobResult.length >= MAX_FILES_PER_POST ? 'opacity-50 pointer-events-none' : ''} file-input file-input-bordered file-input-primary w-full`}
                onChange={async e => {
                  if (e.target.files && e.target.files.length + blobResult.length > MAX_FILES_PER_POST) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setError(`You can select up to ${MAX_FILES_PER_POST} files only.`);
                    e.target.value = "";
                  } else {
                    inputFileRef.current = e.target;
                    let uploadedImages: (string | undefined)[] = [];
                    if (e.target.files) {
                      uploadedImages = await Promise.all(
                        Array.from(e.target.files).map(file => handleImageUpload(file))
                      );
                    }
                    setBlobResult(prev => [...prev, ...uploadedImages.filter((url): url is string => typeof url === 'string')]);
                    setError(null);
                  }
                }} />
            </div>
          </fieldset>

        </div>

        <Divider />

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
                  style={{ objectFit: "contain" }}
                  loading="lazy"
                  placeholder="empty"
                  className="rounded-lg w-[200px] h-[200px] hover:z-10 hover:scale-200 hover:shadow-lg cursor-pointer transition-all"
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
                    removeAddress={`/api/delete/delete-picture?url=${encodeURIComponent(image)}`}
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

        <button
          type="button"
          className="btn btn-outline btn-error p-2 rounded font-bold text-base hover:text-white hover:bg-error/80 transition-colors"
          onClick={() => {
            const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          Delete Post
        </button>

        <button
          type="submit"
          className={`btn btn-outline btn-success p-2 rounded font-bold text-base hover:text-white hover:bg-success/80 transition-colors ${isImageFirst ? '' : 'opacity-50 pointer-events-none'}`}>
          Update Post
        </button>

        <button
          type="button"
          onClick={() => redirect(`/news/${post.id}`)}
          className="btn btn-outline btn-primary p-2 rounded font-bold text-base hover:bg-primary/80 transition-colors">
          Cancel
        </button>
      </form >
    </>
  );
}
