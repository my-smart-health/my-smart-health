'use client';

import { useDeletionProgress } from './DeletionProgressContext';

export default function DeletionProgressModal() {
  const { state } = useDeletionProgress();

  if (!state.isDeleting) return null;

  return (
    <dialog
      open
      className="modal modal-bottom fixed inset-0 bg-black/40 backdrop-blur-sm sm:modal-middle z-[9999]"
    >
      <div className="modal-box bg-white/90 backdrop-blur-md border border-white/20 shadow-xl">
        <h3 className="font-bold text-lg text-error mb-4">
          Profil wird gelöscht...
        </h3>

        <div className="flex flex-col gap-3">
          <div className="text-sm text-gray-700">
            <span>Benutzer: </span>
            <span className="font-semibold">{state.userName}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-error h-full rounded-full animate-pulse"
              style={{ width: '100%' }}
            />
          </div>

          {state.message && (
            <p className="text-xs text-gray-500">
              {state.message}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="loading loading-spinner loading-md text-error" />
            <span className="text-sm text-gray-600">Bitte warten...</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
