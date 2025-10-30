"use client"

import Image from "next/image";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { PutBlobResult } from "@vercel/blob";
import { FormEvent, MouseEvent, useRef, useEffect, useState } from "react";

import logo from "@/public/og-logo-blue.jpg";
import { ArrowUpRight, XIcon, AtSign, Facebook, Globe, Instagram, Linkedin, Youtube } from "lucide-react";
import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';

import { MAX_FILES_PER_POST, MAX_IMAGE_SIZE_MB, MAX_IMAGE_SIZE_BYTES } from "@/utils/constants";
import { isInstagramLink, isYoutubeLink } from "@/utils/common";

type Social = {
  platform: string;
  url: string;
};
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
    socialLinks?: Social[];
  };
};

export default function EditPostForm({ session, post }: EditPostFormProps) {
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.replace('/login');
    }
  }, [session, router]);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [socialLinks, setSocialLinks] = useState<Social[]>(post.socialLinks || []);
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");

  const [isDefaultLogo, setIsDefaultLogo] = useState<boolean>(false);

  const [blobResult, setBlobResult] = useState<string[]>(post.photos || []);
  const baselinePhotosRef = useRef<string[]>(post.photos || []);
  const uploadedNewRef = useRef<string[]>([]);
  const hasSavedRef = useRef<boolean>(false);
  const blobResultRef = useRef<string[]>(post.photos || []);
  useEffect(() => { blobResultRef.current = blobResult; }, [blobResult]);


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

  const statusModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (status) {
      statusModalRef.current?.showModal();
    }
  }, [status]);

  const handleStatusClose = () => {
    setStatus(null);
    statusModalRef.current?.close();
  };

  useEffect(() => {
    const hasPendingNew = () => (uploadedNewRef.current || []).length > 0;
    const photosChanged = () => JSON.stringify(baselinePhotosRef.current) !== JSON.stringify(blobResultRef.current);

    const cleanupNewUploads = (keepalive = false) => {
      if (hasSavedRef.current) return;
      const urls = uploadedNewRef.current || [];
      const deletions = urls
        .filter((u) => !isYoutubeLink(u) && !isInstagramLink(u))
        .map((u) => fetch(`/api/delete/delete-picture?url=${encodeURIComponent(u)}`, {
          method: 'DELETE',
          ...(keepalive ? { keepalive: true } : {}),
        }).catch(() => { }));
      void Promise.allSettled(deletions);
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasSavedRef.current) return;
      if (!hasPendingNew() && !photosChanged()) return;
      e.preventDefault();
      e.returnValue = '';
    };

    const onPageHide = () => cleanupNewUploads(true);

    const onPopState = () => {
      if (hasSavedRef.current) return;
      if (!hasPendingNew() && !photosChanged()) return;
      const ok = window.confirm('You have unsaved changes. Newly uploaded images will be deleted if you leave. Continue?');
      if (!ok) {
        history.go(1);
        return;
      }
      cleanupNewUploads(false);
    };

    const onDocumentClick = async (evt: Event) => {
      if (hasSavedRef.current) return;
      const target = evt.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank') return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (!hasPendingNew() && !photosChanged()) return;
      evt.preventDefault();
      evt.stopPropagation();
      const ok = window.confirm('You have unsaved changes. Newly uploaded images will be deleted if you leave. Continue?');
      if (!ok) return;
      await Promise.resolve(cleanupNewUploads(false));
      if (anchor.origin === window.location.origin) {
        const nextPath = anchor.pathname + anchor.search + anchor.hash;
        router.push(nextPath);
      } else {
        window.location.href = anchor.href;
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onDocumentClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onDocumentClick, true);
      cleanupNewUploads(false);
    };
  }, [router]);

  const handleAddURL = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');

    if (!form) return;
    const formData = new FormData(form);
    const mediaUrl = formData.get(`media`)?.toString().trim();

    if (!mediaUrl || mediaUrl.length === 0) {
      setStatus({ message: 'Media URL cannot be empty', type: 'error' });
      return;
    }

    if (!isYoutubeLink(mediaUrl) && !isInstagramLink(mediaUrl)) {
      setStatus({ message: "Media URL must be a valid YouTube or Instagram link", type: 'error' });
      return;
    }

    setStatus(null);
    const newPhotos = [...blobResult, mediaUrl];
    setBlobResult(newPhotos);
    const resetMediaInput = form.querySelector('input[name="media"]') as HTMLInputElement;
    resetMediaInput.value = '';

  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!file) {
        return undefined;
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setStatus({
          message: `File "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
          type: 'error'
        });
        return undefined;
      }

      setIsDisabled(true);
      const userId = session?.user.id;
      if (!userId) {
        setStatus({ message: 'Not authenticated', type: 'error' });
        setIsDisabled(false);
        return undefined;
      }
      const response = await fetch(
        `/api/upload/upload-picture/?userid=${userId}&filename=${file.name}`,
        {
          method: 'PUT',
          body: file,
        }
      );

      if (!response.ok) {
        setStatus({ message: 'Failed to upload image', type: 'error' });
        setIsDisabled(false);
        return undefined;
      }
      const result = await response.json() as PutBlobResult;
      setIsDisabled(false);
      if (!isYoutubeLink(result.url) && !isInstagramLink(result.url)) {
        uploadedNewRef.current = Array.from(new Set([...uploadedNewRef.current, result.url]));
      }
      return result.url;
    } catch (error) {
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setStatus({ message, type: 'error' });
      setIsDisabled(false);
      return undefined;
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
        setStatus({ message: "First media must be an image", type: 'error' });
        setIsDisabled(false);
        return;
      }
      setStatus(null);

      const result = await fetch(`/api/update/update-post`, {
        method: 'PUT',
        body: JSON.stringify({
          id: post.id,
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
        setStatus({ message: 'Failed to update post', type: 'error' });
        setIsDisabled(false);
        return;
      }
      try {
        const removedExisting = (baselinePhotosRef.current || [])
          .filter((u) => !blobResult.includes(u))
          .filter((u) => !isYoutubeLink(u) && !isInstagramLink(u));
        const unusedNew = (uploadedNewRef.current || [])
          .filter((u) => !blobResult.includes(u))
          .filter((u) => !isYoutubeLink(u) && !isInstagramLink(u));
        const toDelete = [...new Set([...removedExisting, ...unusedNew])];
        if (toDelete.length) {
          await Promise.allSettled(
            toDelete.map((u) => fetch(`/api/delete/delete-picture?url=${encodeURIComponent(u)}`, { method: 'DELETE' }))
          );
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') { console.error('Error deleting unused images:', e); }
      }
      baselinePhotosRef.current = [...blobResult];
      uploadedNewRef.current = [];
      hasSavedRef.current = true;

      setStatus({ message: "Post updated successfully", type: 'success' });
      setIsDisabled(true);
      router.push(`/news/${post.id}`);
    } catch (error) {
      let message = 'Error uploading files';
      if (error instanceof Error) {
        message = error.message;
      }
      setStatus({ message, type: 'error' });
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
        if (!isYoutubeLink(photoUrl) && !isInstagramLink(photoUrl)) {
          await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(photoUrl)}`, {
            method: 'DELETE',
          });
        }
      }

      const result = await fetch(`/api/delete/delete-post?id=${postId}`, {
        method: 'DELETE',
      });

      if (!result.ok) {
        throw new Error('Failed to delete post');
      }

      setStatus({ message: 'Post deleted successfully', type: 'success' });
      const next = session?.user.id ? `/profile/${session.user.id}/news` : '/login';
      router.push(next);

    } catch (error) {
      let message = 'Error deleting post';
      if (error instanceof Error) {
        message = error.message;
        console.error(message);
      }
      setStatus({ message, type: 'error' });
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      {status && (
        <dialog
          ref={statusModalRef}
          id="edit_post_status_modal"
          className="modal modal-bottom backdrop-grayscale-100 transition-all ease-linear duration-500"
          style={{ backgroundColor: 'transparent' }}
          onClose={handleStatusClose}
        >
          <div
            className={`modal-box ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-2xl w-[95%]`}
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
                onClick={handleStatusClose}
                type="button"
              >✕</button>
            </form>
            <h3 className="font-bold text-lg">{status.type === 'success' ? 'Erfolg' : 'Fehler'}</h3>
            <p className="py-4 text-center">{status.message}</p>
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
            <Globe className="inline-block mr-1" size={30} />  Add Social Link
          </button>
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
                <Youtube className="inline-block mr-1" size={30} /> Upload Media URL
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
                    setStatus({ message: `You can select up to ${MAX_FILES_PER_POST} files only.`, type: 'error' });
                    e.target.value = "";
                  } else {
                    inputFileRef.current = e.target;
                    if (e.target.files) {
                      for (const file of Array.from(e.target.files)) {
                        if (file.size > MAX_IMAGE_SIZE_BYTES) {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setStatus({ message: `File "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`, type: 'error' });
                          e.target.value = "";
                          return;
                        }
                      }
                    }
                    let uploadedImages: (string | undefined)[] = [];
                    if (e.target.files) {
                      uploadedImages = await Promise.all(
                        Array.from(e.target.files).map(file => handleImageUpload(file))
                      );
                    }
                    const newPhotos = [...blobResult, ...uploadedImages.filter((url): url is string => typeof url === 'string')];
                    setBlobResult(newPhotos);
                    setStatus(null);
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
          onClick={async () => {
            const hasPendingNew = uploadedNewRef.current.length > 0;
            const photosChanged = JSON.stringify(baselinePhotosRef.current) !== JSON.stringify(blobResult);
            if (hasPendingNew || photosChanged) {
              const ok = window.confirm('Discard changes? Newly uploaded images will be deleted.');
              if (!ok) return;
              const deletions = uploadedNewRef.current
                .filter((u) => !isYoutubeLink(u) && !isInstagramLink(u))
                .map((u) => fetch(`/api/delete/delete-picture?url=${encodeURIComponent(u)}`, { method: 'DELETE' }).catch(() => { }));
              await Promise.allSettled(deletions);
              uploadedNewRef.current = [];
            }
            router.push(`/news/${post.id}`);
          }}
          className="btn btn-outline btn-primary p-2 rounded font-bold text-base hover:bg-primary/80 transition-colors">
          Cancel
        </button>
      </form >
    </>
  );
}
