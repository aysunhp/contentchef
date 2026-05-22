import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import Modal from "./Modal";
import { postService } from "../../services/api";
import { usePosts } from "../../context/PostContext";
import { useFetch } from "../../hooks/useFetch";

const CATEGORIES = [
  "Education",
  "Grammar Tips",
  "Vocabulary",
  "Speaking Practice",
  "Motivation",
  "General",
];
const FORMATS = ["image", "video"];

export default function NewPostModal({
  defaultDate,
  platformType,
  platformHint,
  modalTitle = "New Post",
  defaults = {},
  onClose,
}) {
  const { addPosts } = usePosts();
  const { isLoading, error, execute } = useFetch();

  const [form, setForm] = useState({
    date: defaultDate || new Date().toLocaleDateString("en-CA"),
    topic: defaults.topic || "",
    category: defaults.category || "General",
    formatType: defaults.formatType || "image",
    hook: defaults.hook || "",
    body: defaults.body || "",
  });

  const presetHashtags = Array.isArray(defaults.hashtags) ? defaults.hashtags : [];

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) return;

    const payload = {
      date: form.date,
      topic: form.topic,
      category: form.category,
      formatType: form.formatType,
      status: "draft",
      visualInstructions: "",
      scriptOrCaption: {
        hook: form.hook,
        body: form.body,
        hashtags: presetHashtags,
      },
      platform: platformType || null,
    };

    try {
      const result = await execute(() => postService.create(payload));
      if (result?.data) {
        addPosts([result.data]);
        onClose();
      }
    } catch {
      // error surfaced via useFetch
    }
  };

  return (
    <Modal title={modalTitle} onClose={onClose}>
      {platformHint && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-pastel-sky-border bg-pastel-sky/50 px-3 py-2 dark:border-pastel-sky/30 dark:bg-pastel-sky/10">
          <AlertCircle size={13} className="mt-0.5 shrink-0 text-pastel-sky-text dark:text-pastel-sky" />
          <p className="text-[11px] text-pastel-sky-text dark:text-pastel-sky">
            {platformHint}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-style">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={set("date")}
            className="input-style"
          />
        </div>

        <div>
          <label className="label-style">Topic *</label>
          <input
            type="text"
            value={form.topic}
            onChange={set("topic")}
            placeholder="e.g. Common Grammar Mistakes"
            className="input-style"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-style">Category</label>
            <select
              value={form.category}
              onChange={set("category")}
              className="input-style"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-style">Format</label>
            <select
              value={form.formatType}
              onChange={set("formatType")}
              className="input-style"
            >
              {FORMATS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label-style">Hook</label>
          <input
            type="text"
            value={form.hook}
            onChange={set("hook")}
            placeholder="Opening line that grabs attention"
            className="input-style"
          />
        </div>

        <div>
          <label className="label-style">Caption / Body</label>
          <textarea
            value={form.body}
            onChange={set("body")}
            rows={3}
            placeholder="Main caption or script body"
            className="input-style resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

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
            disabled={isLoading || !form.topic.trim()}
            className="btn-primary px-4"
          >
            {isLoading && <Loader2 size={12} className="animate-spin" />}
            Create Post
          </button>
        </div>
      </form>
    </Modal>
  );
}
