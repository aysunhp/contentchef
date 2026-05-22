import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, hideClose = false }) {
  useEffect(() => {
    if (hideClose) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, hideClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={hideClose ? undefined : onClose}
    >
      <div
        className="animate-fade-in w-full max-w-md rounded-3xl bg-surface-light p-6 shadow-card-dark dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            {title}
          </h2>
          {!hideClose && (
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
