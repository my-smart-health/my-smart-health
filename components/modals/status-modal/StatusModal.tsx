'use client';

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

  let bgClass = "bg-green-500 text-white";
  let title = "Erfolg";
  if (type === "error") {
    bgClass = "bg-red-500 text-white";
    title = "Fehler";
  } else if (type === "warning") {
    bgClass = "bg-yellow-400 text-black";
    title = "Warnung";
  }

  return (
    <dialog open className="modal modal-bottom sm:modal-middle z-50">
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
              Schließen
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}