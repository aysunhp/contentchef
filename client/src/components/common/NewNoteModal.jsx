import { useState } from "react";
import { Loader2, Tag } from "lucide-react";
import Modal from "./Modal";

export default function NewNoteModal({ onClose, onAdd }) {
    const [form, setForm] = useState({
        title: "",
        content: "",
        tags: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;

        setIsLoading(true);
        try {
            // Simple UUID-like ID generation for notes
            const noteId = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const note = {
                id: noteId,
                title: form.title.trim(),
                content: form.content.trim(),
                tags: form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            onAdd?.(note);
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal title="New Note" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label-style">Title *</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={set("title")}
                        placeholder="e.g. Content Ideas for January"
                        className="input-style"
                        required
                    />
                </div>

                <div>
                    <label className="label-style">Note Content</label>
                    <textarea
                        value={form.content}
                        onChange={set("content")}
                        rows={4}
                        placeholder="Write your thoughts, ideas, or reminders..."
                        className="input-style resize-none"
                    />
                </div>

                <div>
                    <label className="label-style flex items-center gap-1">
                        <Tag size={11} /> Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={form.tags}
                        onChange={set("tags")}
                        placeholder="e.g. planning, urgentant, follow-up"
                        className="input-style"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-xs font-medium text-text-secondary-light transition-colors hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !form.title.trim()}
                        className="btn-primary px-4"
                    >
                        {isLoading && <Loader2 size={12} className="animate-spin" />}
                        Create Note
                    </button>
                </div>
            </form>
        </Modal>
    );
}
