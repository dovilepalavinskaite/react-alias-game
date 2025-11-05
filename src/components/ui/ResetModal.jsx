import { useEffect } from "react";

export default function ResetModal({ open, onConfirm, onCancel }) {

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 sm:px-6"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      aria-describedby="reset-desc"
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-[#1b2033] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="reset-title"
          className="text-xl sm:text-2xl font-semibold text-rose-400 text-center sm:text-left"
        >
          Pradėti naują žaidimą?
        </h2>

        <p
          id="reset-desc"
          className="mt-3 text-gray-300 text-sm sm:text-base text-center sm:text-left"
        >
          Tai ištrins visas komandas ir jų surinktus taškus.
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 active:scale-[0.98] transition"
          >
            Atšaukti
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition"
          >
            Taip, ištrinti
          </button>
        </div>
      </div>
    </div>
  );
}