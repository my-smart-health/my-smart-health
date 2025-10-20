'use client';

import { MySmartHealthParagraph } from "@/utils/types";
import Divider from "@/components/divider/Divider";
import { PutBlobResult } from "@vercel/blob";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, File } from "lucide-react";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";

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
          ? { ...paragraph, images: [...(paragraph.images ?? []), ...uploadedUrls] }
          : paragraph
      );
      setParagraphsAction(updatedParagraphs);
      if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
    } catch (error) {
      setErrorAction({ message: `Error uploading images. ${error}`, type: "error" });
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
          ? { ...paragraph, files: [...(paragraph.files ?? []), ...uploadedUrls] }
          : paragraph
      );
      setParagraphsAction(updatedParagraphs);
    } catch (error) {
      setErrorAction({ message: `Error uploading files. ${error}`, type: "error" });
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
          {paragraph.images && paragraph.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {paragraph.images.map((img, imgIdx) => (
                <div key={imgIdx} className="relative">
                  <Link href={img} target="_blank" rel="noreferrer noopener" className="inline-block">
                    <Image
                      key={imgIdx}
                      src={img}
                      alt={`Paragraph ${index + 1} Image ${imgIdx + 1}`}
                      width={100}
                      height={100}
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                      className="rounded"
                    />
                  </Link>
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
                      removeAddress={img}
                      horizontal={true}
                    />
                  </div>
                </div>
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
                          <li key={fileIndex} className="grid grid-cols-2 items-center gap-2">
                            <div key={fileUrl + fileIndex} className="col-span-1 h-auto my-auto">
                              <Link
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="badge badge-primary p-5 text-white w-fit hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link"
                                download={true}
                              >
                                <File /> {fileName}
                              </Link>
                            </div>
                            <button
                              type="button"
                              className="btn btn-circle btn-error text-white hover:bg-error/75 transition-colors duration-200 col-span-1"
                              onClick={async () => {
                                await handleDeleteFile(fileUrl);
                              }}
                            >
                              X
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