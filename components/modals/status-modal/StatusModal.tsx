'use client';

import { useTranslations } from 'next-intl';

export default function StatusModal({
  isOpen,
  onCloseAction,
  message,
  type = "success",
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  message: string;
  type?: "success" | "error" | "warning";
}) {
  if (!isOpen) return null;

  const t = useTranslations('StatusModal');
  let bgClass = "bg-green-500 text-white";
  let title = t('success');
  if (type === "error") {
    bgClass = "bg-red-500 text-white";
    title = t('error');
  } else if (type === "warning") {
    bgClass = "bg-yellow-400 text-black";
    title = t('warning');
  }

  return (
    <dialog open className="modal modal-bottom fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 sm:modal-middle z-50">
      <div className={`modal-box ${bgClass}`}>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onCloseAction}
            >
              {t('close')}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}