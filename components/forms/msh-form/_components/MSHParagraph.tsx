'use client';

import { MySmartHealthParagraph } from "@/utils/types";
import Divider from "@/components/divider/Divider";
import { PutBlobResult } from "@vercel/blob";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import Spinner from "@/components/common/Spinner";
import RichTextEditor from '@/components/forms/rich-text-editor/RichTextEditor';
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, File } from "lucide-react";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";
import { AtSign, Facebook, Globe, Instagram, Linkedin, Youtube } from "lucide-react";
import Xlogo from '@/public/x-logo-black.png';
import TikTokLogo from '@/public/tik-tok-logo.png';
import { MAX_IMAGE_SIZE_MB, MAX_IMAGE_SIZE_BYTES } from "@/utils/constants";
import { isYoutubeLink, isInstagramLink } from "@/utils/common";
import YoutubeEmbed from "@/components/embed/youtube/YoutubeEmbed";
import InstagramEmbed from "@/components/embed/instagram/InstagramEmbed";

export default function MSHParagraph({
  paragraphs,
  setParagraphsAction,
  setErrorAction,
  onAfterChange,
}: {
  paragraphs: MySmartHealthParagraph[];
  setParagraphsAction: (paragraphs: MySmartHealthParagraph[]) => void;
  setErrorAction: (err: { message: string; type: 'success' | 'error' | 'warning' }) => void;
  onAfterChange?: (updatedParagraphs: MySmartHealthParagraph[]) => Promise<void> | void;
}) {

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});
  const [uploadingFiles, setUploadingFiles] = useState<Record<number, boolean>>({});
  const [deletingFiles, setDeletingFiles] = useState<Record<string, boolean>>({});

  const platformIcons: Record<string, ReactNode> = {
    Email: <AtSign className="inline-block mr-1" size={30} />,
    Website: <Globe className="inline-block mr-1" size={30} />,
    Facebook: <Facebook className="inline-block mr-1" size={30} />,
    Linkedin: <Linkedin className="inline-block mr-1" size={30} />,
    X: <Image src={Xlogo} width={30} height={30} alt="X.com" className="w-6 mr-1" />,
    Youtube: <Youtube className="inline-block mr-1" size={30} />,
    TikTok: <Image src={TikTokLogo} width={30} height={30} alt="TikTok" className="w-8 -ml-1" />,
    Instagram: <Instagram className="inline-block mr-1" size={30} />,
  };

  async function handleDelete(index: number) {

    const paragraphToDelete = paragraphs[index];

    const confirmDelete = window.confirm(`Delete paragraph "${paragraphToDelete.title}"?`);
    if (!confirmDelete) return;

    for (const imgUrl of paragraphToDelete.images ?? []) {
      try {
        await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(imgUrl)}`, {
          method: "DELETE",
        });
      } catch (error) {
        setErrorAction({ message: `Error deleting image. ${error}`, type: "error" });
      }
    }

    for (const fileUrl of paragraphToDelete.files ?? []) {
      try {
        await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(fileUrl)}`, {
          method: "DELETE",
        });
      } catch (error) {
        setErrorAction({ message: `Error deleting file. ${error}`, type: "error" });
      }
    }

    const updatedParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphsAction(updatedParagraphs);
  }

  async function handleDeleteFile(fileUrl: string) {
    setDeletingFiles(prev => ({ ...prev, [fileUrl]: true }));
    try {
      await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(fileUrl)}`, {
        method: "DELETE",
      });
    } catch (error) {
      setErrorAction({ message: `Error deleting file. ${error}`, type: "error" });
    }
    const updatedParagraphs = paragraphs.map((paragraph) => {
      return {
        ...paragraph,
        files: paragraph.files?.filter((url) => url !== fileUrl) || [],
      };
    });
    setParagraphsAction(updatedParagraphs);
    setDeletingFiles(prev => ({ ...prev, [fileUrl]: false }));
  }

  function handleAddParagraph() {
    setParagraphsAction([
      ...paragraphs,
      { id: crypto.randomUUID(), title: "", content: "", images: [], files: [] },
    ]);
  }

  function handleTitleChange(index: number, value: string): void {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === index ? { ...paragraph, title: value ?? "" } : paragraph
    );
    setParagraphsAction(updatedParagraphs);
  }

  function handleContentChange(index: number, value: string): void {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === index ? { ...paragraph, content: value } : paragraph
    );
    setParagraphsAction(updatedParagraphs);
  }

  function handleAddSocialLink(index: number) {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === index
        ? { ...paragraph, socialLinks: [...(paragraph.socialLinks ?? []), { platform: '', url: '' }] }
        : paragraph
    );
    setParagraphsAction(updatedParagraphs);
  }

  function handleSocialLinkChange(paragraphIdx: number, linkIdx: number, field: 'platform' | 'url', value: string) {
    const updatedParagraphs = paragraphs.map((paragraph, i) => {
      if (i === paragraphIdx) {
        const updatedLinks = [...(paragraph.socialLinks ?? [])];
        updatedLinks[linkIdx] = { ...updatedLinks[linkIdx], [field]: value };
        return { ...paragraph, socialLinks: updatedLinks };
      }
      return paragraph;
    });
    setParagraphsAction(updatedParagraphs);
  }

  function handleRemoveSocialLink(paragraphIdx: number, linkIdx: number) {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === paragraphIdx
        ? { ...paragraph, socialLinks: paragraph.socialLinks?.filter((_, idx) => idx !== linkIdx) }
        : paragraph
    );
    setParagraphsAction(updatedParagraphs);
  }

  async function handleUploadImages(index: number, files: FileList | null) {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setErrorAction({
          message: `Image "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
          type: "error",
        });
        if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
        return;
      }
    }

    try {
      setUploadingImages(prev => ({ ...prev, [index]: true }));
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const response = await fetch(
          `/api/upload/upload-msh-picture/?filename=${file.name}`,
          {
            method: "PUT",
            body: file,
          }
        );
        if (!response.ok) throw new Error("Failed to upload image");
        const result = (await response.json()) as PutBlobResult;
        uploadedUrls.push(result.url);
      }
      const updatedParagraphs = paragraphs.map((paragraph, i) =>
        i === index
          ? { ...paragraph, images: [...(paragraph.images ?? []), ...uploadedUrls] }
          : paragraph
      );
      setParagraphsAction(updatedParagraphs);
      if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";

      if (onAfterChange) {
        await onAfterChange(updatedParagraphs);
      }
    } catch (error) {
      setErrorAction({ message: `Error uploading images. ${error}`, type: "error" });
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  }

  async function handleUploadFiles(index: number, files: FileList | null) {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setErrorAction({
          message: `File "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
          type: "error",
        });
        return;
      }
    }

    try {
      setUploadingFiles(prev => ({ ...prev, [index]: true }));
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const response = await fetch(
          `/api/upload/upload-msh-file/?filename=${encodeURIComponent(file.name)}`,
          {
            method: "POST",
            body: file,
          }
        );
        if (!response.ok) throw new Error("Failed to upload file");
        const result = (await response.json()) as { url: string };
        uploadedUrls.push(result.url);
      }
      const updatedParagraphs = paragraphs.map((paragraph, i) =>
        i === index
          ? { ...paragraph, files: [...(paragraph.files ?? []), ...uploadedUrls] }
          : paragraph
      );
      setParagraphsAction(updatedParagraphs);

      if (onAfterChange) {
        await onAfterChange(updatedParagraphs);
      }
    } catch (error) {
      setErrorAction({ message: `Error uploading files. ${error}`, type: "error" });
    } finally {
      setUploadingFiles(prev => ({ ...prev, [index]: false }));
    }
  }

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <div key={paragraph.id} className="mb-6">
          <label>
            Paragraph Title:
            <input
              type="text"
              value={paragraph.title ?? ""}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
            />
          </label>

          <Divider addClass="my-4" />

          <div className="block w-full">
            <label className="block mb-2">Paragraph Content:</label>
            <RichTextEditor
              value={paragraph.content || ''}
              onChange={(val: string) => handleContentChange(index, val)}
              placeholder="Write your paragraph content with rich formatting..."
            />
          </div>
          <span className="flex justify-end text-sm text-gray-500">You can resize the text area by dragging the corner. <ArrowUpRight /></span>

          <Divider addClass="my-4" />

          <label>
            Add YouTube or Instagram Video:
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Enter YouTube or Instagram video URL"
                value={youtubeUrls[index] || ""}
                onChange={(e) => {
                  const newUrls = [...youtubeUrls];
                  newUrls[index] = e.target.value;
                  setYoutubeUrls(newUrls);
                }}
                className="input input-bordered input-primary w-full"
              />
              <button
                type="button"
                onClick={async () => {
                  const url = youtubeUrls[index]?.trim();
                  if (url) {
                    const updatedParagraphs = paragraphs.map((p, i) =>
                      i === index
                        ? { ...p, images: [...(p.images ?? []), url] }
                        : p
                    );
                    setParagraphsAction(updatedParagraphs);
                    const newUrls = [...youtubeUrls];
                    newUrls[index] = "";
                    setYoutubeUrls(newUrls);
                    if (onAfterChange) {
                      await onAfterChange(updatedParagraphs);
                    }
                  }
                }}
                className="btn btn-primary whitespace-nowrap"
              >
                <Youtube className="inline-block" size={20} />
                Add
              </button>
            </div>
          </label>

          <Divider addClass="my-4" />

          <label className="flex flex-col gap-1">
            Paragraph Images:
            <input
              ref={el => { fileInputRefs.current[index] = el; }}
              type="file"
              accept="image/*"
              multiple
              className="file-input file-input-bordered file-input-primary w-full disabled:opacity-50"
              disabled={!!uploadingImages[index]}
              onChange={(e) => handleUploadImages(index, e.target.files)}
            />
            <div className="label pt-1">
              <span className="label-text-alt text-gray-500">Maximum file size: {MAX_IMAGE_SIZE_MB}MB per file</span>
            </div>
            {uploadingImages[index] && (
              <Spinner size="sm" label="Uploading images..." />
            )}
          </label>
          {paragraph.images && paragraph.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {paragraph.images.map((img, imgIdx) => {
                const media = isYoutubeLink(img)
                  ? <YoutubeEmbed embedHtml={img} width={200} height={200} />
                  : isInstagramLink(img)
                    ? <InstagramEmbed embedHtml={img} width={200} height={200} />
                    : (
                      <Link href={img} target="_blank" rel="noreferrer noopener" className="inline-block">
                        <Image
                          src={img}
                          alt={`Paragraph ${index + 1} Image ${imgIdx + 1}`}
                          width={100}
                          height={100}
                          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                          className="rounded"
                        />
                      </Link>
                    );

                return (
                  <div key={imgIdx} className="relative">
                    {media}
                    <div className="flex justify-center align-middle">
                      <MoveImageVideo
                        index={imgIdx}
                        blobResult={paragraph.images ?? []}
                        setBlobResultAction={(newImages) => {
                          const updatedParagraphs = paragraphs.map((p, i) =>
                            i === index ? { ...p, images: newImages } : p
                          );
                          setParagraphsAction(updatedParagraphs);
                        }}
                        showTop={imgIdx > 0}
                        showBottom={imgIdx < (paragraph.images?.length || 0) - 1}
                        removeAddress={`/api/delete/delete-picture?url=${encodeURIComponent(img)}`}
                        horizontal={true}
                        onAfterDelete={async (newImages) => {
                          const updatedParagraphs = paragraphs.map((p, i) =>
                            i === index ? { ...p, images: newImages } : p
                          );
                          if (onAfterChange) {
                            await onAfterChange(updatedParagraphs);
                          }
                        }}
                        onAfterMove={async (newImages) => {
                          const updatedParagraphs = paragraphs.map((p, i) =>
                            i === index ? { ...p, images: newImages } : p
                          );
                          if (onAfterChange) {
                            await onAfterChange(updatedParagraphs);
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Divider addClass="my-4" />

          <label className="flex flex-col gap-1">
            Paragraph Files:
            <input
              type="file"
              multiple
              className="file-input file-input-bordered file-input-primary w-full disabled:opacity-50"
              disabled={!!uploadingFiles[index]}
              onChange={(e) => handleUploadFiles(index, e.target.files)}
              accept="*"
            />
            <div className="label pt-1">
              <span className="label-text-alt text-gray-500">Maximum file size: {MAX_IMAGE_SIZE_MB}MB per file</span>
            </div>
            {uploadingFiles[index] && (
              <Spinner size="sm" label="Uploading files..." />
            )}
          </label>
          {(paragraph.files ?? []).length > 0 && (
            <ul className="mt-2 space-y-1">
              <section className="grid grid-cols-1 gap-3">
                {paragraph.files && paragraph.files.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold mb-1">Dateien:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {paragraph.files.map((fileUrl, fileIndex) => {
                        const fileName = fileUrl.replace(/^.*[\\\/]/, '').replaceAll('?download=1', '');
                        return (
                          <li key={fileIndex} className="flex items-center gap-2">
                            <div key={fileUrl + fileIndex} className="w-full h-auto my-auto">
                              <Link
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="badge badge-primary p-5 text-white w-full h-fit hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link"
                                download={true}
                              >
                                <div className='min-w-fit'>
                                  <File size={30} />
                                </div>
                                {fileName}
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="btn btn-circle btn-error text-white hover:bg-error/75 transition-colors duration-200 disabled:opacity-50"
                              disabled={!!deletingFiles[fileUrl]}
                              onClick={async () => {
                                const confirmDelete = window.confirm(`Delete file "${fileName}"?`);
                                if (!confirmDelete) return;
                                await handleDeleteFile(fileUrl);
                              }}
                            >
                              {deletingFiles[fileUrl] ? <Spinner size="xs" colorClass="text-white" /> : 'X'}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </section>
            </ul>
          )}

          <Divider addClass="my-4" />

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Social Links:</h4>
            {(paragraph.socialLinks ?? []).map((link, linkIdx) => (
              <div key={linkIdx} className="flex flex-row flex-wrap gap-4 items-center mb-4">
                <input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, linkIdx, 'url', e.target.value)}
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
                      onChange={(e) => handleSocialLinkChange(index, linkIdx, 'platform', e.target.value)}
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
                    onClick={() => handleRemoveSocialLink(index, linkIdx)}
                    className="btn btn-outline text-red-500 self-end"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddSocialLink(index)}
              className="btn btn-outline btn-primary px-3 py-1 w-full rounded"
            >
              Add Social Link
            </button>
          </div>

          <Divider addClass="my-4" />

          <button
            type="button"
            onClick={() => handleDelete(index)}
            className="btn btn-outline border-red-500 text-red-500 hover:border-red-500/90 hover:text-white hover:bg-red-400/90 text-lg mx-auto flex gap-2 rounded transition-all ease-in-out duration-300"
          >
            Delete Paragraph
          </button>
        </div>
      ))}

      <Divider addClass="my-4" />

      <button
        type="button"
        onClick={handleAddParagraph}
        className="btn btn-primary text-lg mx-auto flex gap-2 rounded"
      >
        Add Paragraph
      </button>
    </>
  );
}