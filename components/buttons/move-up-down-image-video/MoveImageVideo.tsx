'use client';

import React, { useState } from "react";
import { Triangle } from "lucide-react";

import Divider from "@/components/divider/Divider";
import Spinner from "@/components/common/Spinner";

type MoveImageVideoProps = {
  index: number;
  blobResult: string[];
  setBlobResultAction: (blobs: string[]) => void;
  showTop: boolean;
  showBottom: boolean;
  removeAddress?: string;
  horizontal?: boolean;
  onAfterDelete?: (updatedBlobs: string[]) => Promise<void> | void;
  onAfterMove?: (updatedBlobs: string[]) => Promise<void> | void;
};

export default function MoveImageVideo({
  index,
  blobResult,
  setBlobResultAction,
  showTop = true,
  showBottom = true,
  removeAddress,
  horizontal,
  onAfterDelete,
  onAfterMove
}: MoveImageVideoProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOnePositionUp = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    if (index === 0) return;
    const newBlobResult = [...blobResult];
    const previous = newBlobResult[index - 1];
    newBlobResult[index - 1] = newBlobResult[index];
    newBlobResult[index] = previous;
    setBlobResultAction(newBlobResult);

    if (onAfterMove) {
      await onAfterMove(newBlobResult);
    }
  };

  const handleOnePositionDown = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    if (index === blobResult.length - 1) return;
    const newBlobResult = [...blobResult];
    const next = newBlobResult[index + 1];
    newBlobResult[index + 1] = newBlobResult[index];
    newBlobResult[index] = next;
    setBlobResultAction(newBlobResult);

    if (onAfterMove) {
      await onAfterMove(newBlobResult);
    }
  };

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, index: number, removeAddress?: string) => {
    e.preventDefault();
    const fileUrl = blobResult[index];
    const fileName = fileUrl ? fileUrl.split('/').pop() : `item ${index + 1}`;
    const confirmDelete = window.confirm(`Delete media "${fileName}"?`);
    if (!confirmDelete) return;

    const newBlobResult = [...blobResult];
    newBlobResult.splice(index, 1);
    setBlobResultAction(newBlobResult);

    if (removeAddress) {
      try {
        setIsDeleting(true);
        const response = await fetch(removeAddress, {
          method: 'DELETE'
        });

        if (!response.ok) {
          console.error('Failed to delete file from storage');
          setIsDeleting(false);
          return;
        }

        if (onAfterDelete) {
          await onAfterDelete(newBlobResult);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error removing media:', error);
        }
      } finally {
        setIsDeleting(false);
      }
    } else {
      try {
        setIsDeleting(true);
        if (onAfterDelete) {
          await onAfterDelete(newBlobResult);
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (blobResult.length === 0) return null;

  if (blobResult.length === 1) {
    return (
      <button
        type="button"
        className="btn btn-outline btn-circle text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
        disabled={isDeleting}
        onClick={(e) => handleRemove(e, index, removeAddress)}>
        {isDeleting ? <Spinner size="sm" colorClass="text-red-500" /> : 'x'}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {showTop && (
        <>
          <button
            type="button"
            className="btn btn-outline btn-circle text-primary hover:text-primary/80 transition-colors cursor-pointer disabled:opacity-50"
            disabled={isDeleting}
            onClick={(e) => handleOnePositionUp(e, index)}><Triangle fill="currentColor" className={horizontal ? "rotate-270" : ""} />
          </button>

          <Divider />
        </>
      )}
      <button
        type="button"
        className="btn btn-outline btn-circle text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
        disabled={isDeleting}
        onClick={(e) => handleRemove(e, index, removeAddress)}>
        {isDeleting ? <Spinner size="sm" colorClass="text-red-500" /> : 'x'}
      </button>

      {showBottom && (
        <>
          <Divider />

          <button
            type="button"
            className="btn btn-outline btn-circle text-primary hover:text-primary/80 transition-colors cursor-pointer disabled:opacity-50"
            disabled={isDeleting}
            onClick={(e) => handleOnePositionDown(e, index)}><Triangle fill="currentColor" className={horizontal ? "rotate-90" : "rotate-180"} />
          </button>
        </>
      )}
    </div>
  );
}