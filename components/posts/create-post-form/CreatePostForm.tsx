"use client";

import Image from "next/image";
import { Session } from "next-auth";
import { PutBlobResult } from "@vercel/blob";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { ErrorState } from "@/utils/types";
import { getModalColor } from "@/utils/common";
import { MAX_FILES_PER_POST } from "@/utils/constants";

import Divider from "@/components/divider/Divider";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";

import logo from '@/public/og-logo-blue.jpg';
import { ArrowUpRight, XIcon, AtSign, Facebook, Globe, Instagram, Linkedin, Youtube } from "lucide-react";
import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';

type Social = {
  platform: string;
  url: string;
};

type CreatePostFormProps = {
  session: Session | null;
};

type HandleUploadImagesParams = {
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<ErrorState>>;
  e: React.ChangeEvent<HTMLInputElement>;
  handleImageUpload: (file: File) => Promise<string | undefined>;
  setBlobResult: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function CreatePostForm({ session }: CreatePostFormProps) {

  if (!session) {
    redirect('/login');
  }
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<ErrorState>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDefaultLogo, setIsDefaultLogo] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<Social[]>([]);

  const [blobResult, setBlobResult] = useState<string[]>([]);

  const [isImageFirst, setIsImageFirst] = useState<boolean>(true);

  const platformIcons: Record<string, React.ReactNode> = {
    Email: <AtSign className="inline-block mr-1" size={30} />,
    Website: <Globe className="inline-block mr-1" size={30} />,
    Facebook: <Facebook className="inline-block mr-1" size={30} />,
    Linkedin: <Linkedin className="inline-block mr-1" size={30} />,
    X: <Image src={Xlogo} width={30} height={30} alt="X.com" className="w-6 mr-1" />,
    Youtube: <Youtube className="inline-block mr-1" size={30} />,
    TikTok: <Image src={TikTokLogo} width={30} height={30} alt="TikTok" className="w-8 -ml-1" />,
    Instagram: <Instagram className="inline-block mr-1" size={30} />,
  };

  const errorModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (error) {
      errorModalRef.current?.showModal();
    }
  }, [error]);

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
    setIsDisabled(true);
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);
    const mediaUrl = formData.get(`media`)?.toString().trim();

    if (!mediaUrl || mediaUrl.length === 0) {
      setError({ type: "error", message: "Media URL cannot be empty" });
      setIsDisabled(false);
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
      setIsDisabled(false);
    } else {
      setError({ type: "error", message: "Media URL must be a valid YouTube or Instagram link" });
      setIsDisabled(false);
      return;
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!file) {
        setIsDisabled(false);
        return;
      }
      const response = await fetch(
        `/api/upload/upload-picture/?userid=${session.user.id}&filename=${file.name}`,
        {
          method: 'PUT',
          body: file,
        }
      );

      const result = await response.json() as PutBlobResult;

      if (!response.ok) {
        setError({ type: "error", message: "Failed to upload image" });
        setIsDisabled(false);
        throw new Error('Failed to upload image');
      }

      return result.url;
    } catch (error) {
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setError({ type: "error", message });
      setIsDisabled(false);
      return logo.src;
    }
  };

  const handleUploadImages = async ({
    setIsDisabled,
    setError,
    e,
    handleImageUpload,
    setBlobResult
  }: HandleUploadImagesParams): Promise<void> => {
    setIsDisabled(true);
    setError(null);
    const uploadedImages = await Promise.all(
      Array.from(e.target.files ?? []).map(file => handleImageUpload(file))
    );
    setBlobResult(prev => [
      ...prev,
      ...uploadedImages.filter((url): url is string => typeof url === 'string'),
    ]);
    setIsDisabled(false);
    e.target.value = "";
  };

  const handleError = () => {
    if (error?.type === "success") {
      setIsDisabled(true);
      setError(null);
      errorModalRef.current?.close();
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      return;
    } else if (isDefaultLogo === true) {
      setIsDisabled(true);
      setError(null);
      errorModalRef.current?.close();
    } else {
      setError(null);
      setIsDisabled(false);
      errorModalRef.current?.close();
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

  const handleAddSocialLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const handleRemoveSocialLink = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      event.preventDefault();
      setIsDisabled(true);
      const formData = new FormData(event.currentTarget);

      if (blobResult.length === 0) {
        setError(null);
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
        setError({ type: "warning", message: "First media must be an image" });
        setIsDisabled(false);
        return;
      }

      const result = await fetch(`/api/create/create-post`, {
        method: 'POST',
        body: JSON.stringify({
          authorId: session.user.id,
          title: formData.get('title'),
          content: formData.get('content'),
          photos: blobResult,
          tags: tags.filter(tag => tag.trim() !== ''),
          socialLinks: socialLinks.filter(link => link.url.trim() !== '' && link.platform.trim() !== ''),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!result.ok) {
        setError({ type: "error", message: "Failed to create post" });
        setIsDisabled(false);
        return;
      }
      setIsDisabled(true);
      setError({ type: "success", message: "Post created successfully" });
    } catch (error) {
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setError({ type: "error", message });
      setIsDisabled(false);
      return;
    }
  };

  return (
    <>
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
            rows={2}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
          <div className="label pt-1 text-xs flex flex-row justify-end">You can pull the right corner to resize it <ArrowUpRight /></div>
        </fieldset>

        <Divider />

        <fieldset className="fieldset">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={5}
            required
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
          <div className="label pt-1 text-xs flex flex-row justify-end">You can pull the right corner to resize it <ArrowUpRight /></div>
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

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Social Links</legend>
          {socialLinks.length > 0 && (
            <div className="flex flex-col gap-4 mb-4">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex flex-row flex-wrap gap-4 items-center">
                  <input
                    type="text"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary flex-1 min-w-[200px]"
                  />
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center max-w-[40px]">
                        {platformIcons[link.platform] || null}
                      </span>
                      <select
                        className="select select-bordered select-primary w-full max-w-xs border-primary"
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      >
                        <option disabled value="">Pick a platform</option>
                        <option value="Email">Email</option>
                        <option value="Website">Website</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Linkedin">Linkedin</option>
                        <option value="X">X.com</option>
                        <option value="Youtube">Youtube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveSocialLink(e, index)}
                      className="btn btn-outline text-red-500 self-end"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={handleAddSocialLink} className="btn btn-outline btn-primary px-3 py-1 w-full rounded">
            Add Social Link
          </button>
        </fieldset>

        <Divider />

        <div className={blobResult.length >= MAX_FILES_PER_POST ? 'opacity-50 pointer-events-none' : ''}>
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
                onClick={handleAddURL}
                className="btn w-full btn-primary mt-2"
              >
                Upload Media URL
              </button>
            </div>
          </fieldset>

          <Divider addClass="my-5" />

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Select File</legend>
            <div className="flex flex-wrap gap-4 w-full">
              <input
                type="file"
                ref={inputFileRef}
                id="image"
                name="image"
                accept="image/*"
                multiple
                className={`${blobResult && blobResult.length >= MAX_FILES_PER_POST ? 'opacity-50 pointer-events-none' : ''} file-input file-input-bordered file-input-primary w-full`}
                onChange={async e => {
                  if (!e.target.files || e.target.files.length + blobResult.length > MAX_FILES_PER_POST) {
                    setError({ type: "warning", message: `You can select up to ${MAX_FILES_PER_POST} files only.` });
                    e.target.value = "";
                  } else {
                    inputFileRef.current = e.target;
                    if (e.target.files) {
                      await handleUploadImages({
                        setIsDisabled,
                        setError,
                        e,
                        handleImageUpload,
                        setBlobResult
                      });
                    }
                  }
                }} />
            </div>
          </fieldset>
        </div>

        <Divider />

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
                  loading="lazy"
                  placeholder="empty"
                  style={{ objectFit: "contain", width: WIDTH, height: HEIGHT }}
                  className={`rounded-lg hover:border hover:bg-primary/50 hover:z-10 hover:p-1 hover:border-primary hover:scale-200 cursor-pointer transition-all`}
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
                    removeAddress={image}
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

      <dialog
        ref={errorModalRef}
        id="error_modal"
        className="modal modal-bottom backdrop-grayscale-100 transition-all ease-linear duration-500"
        style={{ backgroundColor: 'transparent' }}
        onClose={handleError}
      >
        <div
          className={`modal-box ${getModalColor(error, isDefaultLogo)} text-white rounded-2xl w-[95%]`}
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
              onClick={handleError}
              type="button"
            >✕</button>
          </form>
          <h3 className="font-bold text-lg">
            {error?.type === 'success'
              ? 'Success!'
              : error?.type === 'warning'
                ? 'Warning'
                : 'Error'}
          </h3>
          {isDefaultLogo && error?.type === "success" ? (
            <div className="flex flex-col items-center py-4">
              <span className="p-2 text-center break-after-auto">
                No image file was selected, default logo will be used
              </span>
              <span className="text-sm text-white italic">
                You can change it later in the edit post section
              </span>
            </div>
          ) : (
            <p className="py-4">{error?.message}</p>
          )}
        </div>
      </dialog>
    </>
  );
}