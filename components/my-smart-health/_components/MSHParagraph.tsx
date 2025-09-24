'use client';

import { MySmartHealthParagraph } from "@/utils/types";
import Divider from "@/components/divider/Divider";
import { PutBlobResult } from "@vercel/blob";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function MSHParagraph({
  paragraphs,
  setParagraphsAction,
  setErrorAction,
}: {
  paragraphs: MySmartHealthParagraph[];
  setParagraphsAction: (paragraphs: MySmartHealthParagraph[]) => void;
  setErrorAction: (err: { message: string; type: 'success' | 'error' | 'warning' }) => void;
}) {

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleDelete(index: number) {
    const paragraphToDelete = paragraphs[index];

    for (const imgUrl of paragraphToDelete.images) {
      try {
        await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(imgUrl)}`, {
          method: "DELETE",
        });
      } catch (error) {
        setErrorAction({ message: "Error deleting image.", type: "error" });
      }
    }

    for (const fileUrl of paragraphToDelete.files) {
      try {
        await fetch(`/api/delete/delete-picture?url=${encodeURIComponent(fileUrl)}`, {
          method: "DELETE",
        });
      } catch (error) {
        setErrorAction({ message: "Error deleting file.", type: "error" });
      }
    }

    const updatedParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphsAction(updatedParagraphs);
  }

  function handleAddParagraph() {
    setParagraphsAction([
      ...paragraphs,
      { id: crypto.randomUUID(), title: "", content: "", images: [], files: [] },
    ]);
  }

  function handleTitleChange(index: number, value: string): void {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === index ? { ...paragraph, title: value } : paragraph
    );
    setParagraphsAction(updatedParagraphs);
  }

  function handleContentChange(index: number, value: string): void {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === index ? { ...paragraph, content: value } : paragraph
    );
    setParagraphsAction(updatedParagraphs);
  }

  async function handleUploadImages(index: number, files: FileList | null) {
    if (!files || files.length === 0) return;
    try {
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
          ? { ...paragraph, images: [...paragraph.images, ...uploadedUrls] }
          : paragraph
      );
      setParagraphsAction(updatedParagraphs);
      if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
    } catch (error) {
      setErrorAction({ message: "Error uploading images.", type: "error" });
    }
  }

  const MAX_FILE_SIZE_MB = 4;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

  async function handleUploadFiles(index: number, files: FileList | null) {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorAction({
          message: `File "${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
          type: "error",
        });
        return;
      }
    }

    try {
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
          ? { ...paragraph, files: [...paragraph.files, ...uploadedUrls] }
          : paragraph
      );
      setParagraphsAction(updatedParagraphs);
    } catch (error) {
      setErrorAction({ message: "Error uploading files.", type: "error" });
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
              value={paragraph.title}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
              required
            />
          </label>

          <Divider addClass="my-4" />

          <label>
            Paragraph Content:
            <textarea
              value={paragraph.content}
              onChange={(e) => handleContentChange(index, e.target.value)}
              className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
              required
              rows={7}
            />
          </label>
          <span className="flex justify-end text-sm text-gray-500">You can resize images by dragging the corner. <ArrowUpRight /></span>
          <Divider addClass="my-4" />

          <label>
            Paragraph Images:
            <input
              ref={el => { fileInputRefs.current[index] = el; }}
              type="file"
              accept="image/*"
              multiple
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={(e) => handleUploadImages(index, e.target.files)}
            />
          </label>
          {paragraph.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {paragraph.images.map((img, imgIdx) => (
                <Image
                  key={imgIdx}
                  src={img}
                  alt={`Paragraph ${index + 1} Image ${imgIdx + 1}`}
                  width={80}
                  height={80}
                  style={{ objectFit: 'contain' }}
                  className="w-20 h-20  rounded"
                />
              ))}
            </div>
          )}

          <Divider addClass="my-4" />

          <label>
            Paragraph Files:
            <input
              type="file"
              multiple
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={(e) => handleUploadFiles(index, e.target.files)}
              accept="*"
            />
          </label>
          {paragraph.files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {paragraph.files.map((fileUrl, fileIdx) => (
                <li key={fileIdx}>
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline rounded btn-primary underline break-all"
                    download={true}
                  >
                    {fileUrl.split('/').pop()}
                  </Link>
                </li>
              ))}
            </ul>
          )}

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