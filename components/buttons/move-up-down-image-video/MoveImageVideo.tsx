'use client';

import Divider from "@/components/divider/Divider";
import { Triangle } from "lucide-react";
import React from "react";

type MoveImageVideoProps = {
  index: number;
  blobResult: string[];
  setBlobResultAction: (blobs: string[]) => void;
  showTop: boolean;
  showBottom: boolean;
  removeAddress: string;
};

export default function MoveImageVideo({ index, blobResult, setBlobResultAction, showTop = true, showBottom = true, removeAddress }: MoveImageVideoProps) {

  const handleOnePositionUp = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    if (index === 0) return;
    const newBlobResult = [...blobResult];
    const previous = newBlobResult[index - 1];
    newBlobResult[index - 1] = newBlobResult[index];
    newBlobResult[index] = previous;
    setBlobResultAction(newBlobResult);
  };

  const handleOnePositionDown = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    if (index === blobResult.length - 1) return;
    const newBlobResult = [...blobResult];
    const next = newBlobResult[index + 1];
    newBlobResult[index + 1] = newBlobResult[index];
    newBlobResult[index] = next;
    setBlobResultAction(newBlobResult);
  };

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, index: number, removeAddress?: string) => {
    e.preventDefault();
    const newBlobResult = [...blobResult];
    newBlobResult.splice(index, 1);
    setBlobResultAction(newBlobResult);

    if (removeAddress) {
      try {
        await fetch(removeAddress, { method: 'DELETE' });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error removing media:', error);
        }
      }
    }
  };

  if (blobResult.length === 0) return null;

  if (blobResult.length === 1) {
    return (
      <button
        type="button"
        className="btn btn-outline btn-circle text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        onClick={(e) => handleRemove(e, index, removeAddress)}>x</button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {showTop && (
        <>
          <button
            type="button"
            className="btn btn-outline btn-circle text-primary hover:text-primary/80 transition-colors cursor-pointer"
            onClick={(e) => handleOnePositionUp(e, index)}><Triangle fill="currentColor" />
          </button>

          <Divider />
        </>
      )}
      <button
        type="button"
        className="btn btn-outline btn-circle text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        onClick={(e) => handleRemove(e, index, removeAddress)}>x</button>

      {showBottom && (
        <>
          <Divider />

          <button
            type="button"
            className="btn btn-outline btn-circle text-primary hover:text-primary/80 transition-colors cursor-pointer"
            onClick={(e) => handleOnePositionDown(e, index)}><Triangle fill="currentColor" className="rotate-180" />
          </button>
        </>
      )}
    </div>
  );
}