'use client';

import { useRef, useEffect } from "react";

export default function DeletePostModal({
  isOpen,
  onCloseAction,
  onDeleteAction,
  message = "Möchten Sie diesen Beitrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  onDeleteAction: () => void;
  message?: string;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      className="modal modal-bottom fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50 backdrop-grayscale-100 transition-all ease-linear duration-500"
      style={{ backgroundColor: 'transparent' }}
      onClose={onCloseAction}
    >
      <div
        className="modal-box bg-red-400 text-white rounded-2xl w-[95%]"
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
            className="btn btn-sm btn-circle btn-ghost hover:bg-green-600 absolute right-2 top-2 text-white transition-all ease-in-out duration-300"
            onClick={onCloseAction}
            type="button"
          >✕</button>
        </form>
        <h3 className="font-bold text-lg mb-4">Beitrag löschen?</h3>
        <p className="py-2 text-center">{message}</p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="btn btn-outline bg-red-500/80 text-white"
            type="button"
            onClick={onDeleteAction}
          >
            Löschen
          </button>
          <button
            className="btn btn-outline bg-green-600 text-white"
            type="button"
            onClick={onCloseAction}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </dialog>
  );
}