import { ForwardedRef } from "react";

type ErrorType = "success" | "warning" | "error";
type ErrorState = { type: ErrorType; message: string } | null;

export default function ErrorModal({
  error,
  errorModalRef,
  getModalColor,
  handleError,
}: {
  error: ErrorState;
  errorModalRef: ForwardedRef<HTMLDialogElement>;
  getModalColor: () => string;
  handleError: () => void;
}) {
  if (!error) return null;
  return (
    <dialog
      ref={errorModalRef}
      id="register_error_modal"
      className="modal modal-bottom backdrop-grayscale-100 transition-all ease-linear duration-500"
      style={{ backgroundColor: "transparent" }}
      onClose={handleError}
    >
      <div
        className={`modal-box ${getModalColor()} text-white rounded-2xl w-[95%]`}
        style={{
          width: "80vw",
          maxWidth: "80vw",
          margin: "2rem auto",
          left: 0,
          right: 0,
          bottom: 0,
          position: "fixed",
          minHeight: "unset",
          padding: "2rem 1.5rem",
        }}
      >
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
            onClick={handleError}
            type="button"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          {error.type === "success"
            ? "Erfolg"
            : error.type === "warning"
              ? "Warnung"
              : "Fehler"}
        </h3>
        <p className="py-4 text-center">{error.message}</p>
      </div>
    </dialog>
  );
}