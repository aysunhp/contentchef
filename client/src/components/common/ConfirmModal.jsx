import { AlertTriangle, X } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmModal({ title, message, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangle size={32} className="text-red-500 dark:text-red-400" />
        </div>

        <h3 className="mb-2 text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          {title}
        </h3>

        <p className="mb-6 max-w-[280px] text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {message}
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200/60 px-4 py-2.5 text-xs font-medium text-text-secondary-light transition-colors hover:bg-gray-100 dark:border-white/10 dark:text-text-secondary-dark dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
