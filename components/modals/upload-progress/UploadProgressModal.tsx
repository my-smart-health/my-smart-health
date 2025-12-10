'use client';

import { useUploadProgress } from './UploadProgressContext';

export default function UploadProgressModal() {
  const { state } = useUploadProgress();

  if (!state.isUploading) return null;

  const percentage = state.totalFiles > 0
    ? Math.round((state.completedFiles / state.totalFiles) * 100)
    : 0;

  return (
    <dialog
      open
      className="modal modal-bottom fixed inset-0 bg-black/40 backdrop-blur-sm sm:modal-middle z-[9999]"
    >
      <div className="modal-box bg-white/90 backdrop-blur-md border border-white/20 shadow-xl">
        <h3 className="font-bold text-lg text-primary mb-4">
          Dateien werden hochgeladen...
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Fortschritt</span>
            <span className="font-semibold">
              {state.completedFiles} / {state.totalFiles} Dateien
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {state.currentFileName && (
            <p className="text-xs text-gray-500 truncate">
              Aktuelle Datei: <span className="font-medium">{state.currentFileName}</span>
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="loading loading-spinner loading-md text-primary" />
            <span className="text-sm text-gray-600">Bitte warten...</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
