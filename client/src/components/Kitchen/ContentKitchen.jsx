import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Sparkles,
  Video,
  ImageIcon,
  Hash,
  Check,
  Loader2,
  Trash2,
  Wand2,
} from "lucide-react";
import { usePosts } from "../../context/PostContext";
import { useMedia } from "../../context/MediaContext";
import { postService, mediaService } from "../../services/api";
import { generateMoodboardImage } from "../../services/puterAi";
import { useFetch } from "../../hooks/useFetch";
import { STATUS_COLORS, FORMAT_LABELS } from "../../constants/theme";
import ConfirmModal from "../common/ConfirmModal";

const STATUSES = ["draft", "review", "published"];
const FORMATS = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export default function ContentKitchen() {
  const { selectedPost, selectPost, updatePost, deletePost } = usePosts();
  const { addMedia, fetchMedia } = useMedia();
  const { isLoading, error, execute } = useFetch();
  const fileInputRef = useRef(null);

  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const [moodLoading, setMoodLoading] = useState(false);
  const [moodError, setMoodError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      setDraft({
        status: selectedPost.status,
        formatType: selectedPost.formatType || "image",
        hook: selectedPost.scriptOrCaption?.hook || "",
        body: selectedPost.scriptOrCaption?.body || "",
        hashtags: (selectedPost.scriptOrCaption?.hashtags || []).join(" "),
      });
      setPendingImageUrl(selectedPost.mediaUrl || null);
      setSaved(false);
      setMoodError(null);
    }
  }, [selectedPost]);

  const handleGenerateMoodboard = async () => {
    setMoodLoading(true);
    setMoodError(null);
    try {
      const data = await generateMoodboardImage(
        selectedPost.topic,
        selectedPost.visualInstructions,
      );
      setPendingImageUrl(data.imageUrl);
    } catch (err) {
      setMoodError(err.message || "Failed to generate moodboard");
    } finally {
      setMoodLoading(false);
    }
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPendingImageUrl(dataUrl);
      setMoodError(null);
      setDraft((prev) => ({ ...prev, formatType: "image" }));
    } catch (err) {
      setMoodError(err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImageFile(file);
  };

  const handleSave = async () => {
    const updates = {
      status: draft.status,
      formatType: draft.formatType,
      scriptOrCaption: {
        hook: draft.hook,
        body: draft.body,
        hashtags: draft.hashtags.split(/\s+/).filter((t) => t.startsWith("#")),
      },
    };

    if (pendingImageUrl) {
      updates.mediaUrl = pendingImageUrl;
    } else if (selectedPost.mediaUrl) {
      updates.mediaUrl = null;
    }

    const result = await execute(() =>
      postService.update(selectedPost.id, updates),
    );

    if (result?.data) {
      updatePost(result.data);

      if (pendingImageUrl) {
        const mediaRes = await mediaService.create({
          url: pendingImageUrl,
          topic: selectedPost.topic,
          postId: selectedPost.id,
        });
        if (mediaRes?.data) {
          addMedia(mediaRes.data);
          await fetchMedia();
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await execute(() => postService.delete(selectedPost.id));
      deletePost(selectedPost.id);
      setShowDeleteModal(false);
      selectPost(null);
    } catch {
      setShowDeleteModal(false);
    }
  };

  if (!selectedPost || !draft) {
    return (
      <section className="hidden w-[380px] flex-col items-center justify-center bg-surface-light/50 dark:bg-surface-dark/50 lg:flex">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light/10 dark:bg-primary-dark/10">
            <Sparkles
              size={28}
              className="text-primary-light dark:text-primary-dark"
            />
          </div>
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
            Content Kitchen
          </h3>
          <p className="max-w-[200px] text-xs text-text-secondary-light dark:text-text-secondary-dark">
            Select a card from the calendar to start cooking your content.
          </p>
        </div>
      </section>
    );
  }

  const set = (field) => (e) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const statusStyle = STATUS_COLORS[draft.status] || STATUS_COLORS.draft;
  const displayImage = pendingImageUrl;

  return (
    <section className="animate-slide-in flex w-[380px] flex-col overflow-hidden border-l border-gray-200/60 bg-surface-light/50 dark:border-white/5 dark:bg-surface-dark/50">
      <header className="flex items-center justify-between border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
        <div>
          <h2 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            Content Kitchen
          </h2>
          <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
            {selectedPost.date}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => selectPost(null)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary-light transition-colors hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="scrollbar-hidden flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-4">
          <label className="label-style">Status</label>
          <div className="flex gap-1.5">
            {STATUSES.map((s) => {
              const st = STATUS_COLORS[s];
              return (
                <button
                  key={s}
                  onClick={() => setDraft((prev) => ({ ...prev, status: s }))}
                  className={`rounded-lg px-3 py-1 text-[10px] font-semibold uppercase transition-all ${st.bg} ${st.text} ${
                    draft.status === s
                      ? "ring-2 ring-offset-1 ring-current"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <label className="label-style">Format</label>
            <select
              value={draft.formatType}
              onChange={set("formatType")}
              className="input-style"
            >
              {FORMATS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-style">Category</label>
            <div className="flex h-[34px] items-center rounded-xl border border-gray-200/80 bg-gray-50 px-3 text-xs text-text-secondary-light dark:border-white/10 dark:bg-white/[0.03] dark:text-text-secondary-dark">
              {selectedPost.category}
            </div>
          </div>
        </div>

        <h3 className="mb-5 text-base font-bold text-text-primary-light dark:text-text-primary-dark">
          {selectedPost.topic}
        </h3>

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="label-style">Visual / Media</label>
            <button
              type="button"
              onClick={handleGenerateMoodboard}
              disabled={moodLoading}
              className="flex items-center gap-1 rounded-lg border border-pastel-violet-border bg-pastel-violet px-2 py-1 text-[10px] font-medium text-pastel-violet-text transition-colors hover:bg-pastel-violet-hover disabled:opacity-50"
            >
              {moodLoading ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Wand2 size={10} />
              )}
              AI Moodboard
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageFile(e.target.files?.[0])}
          />

          {displayImage ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200/60 dark:border-white/10">
              <img
                src={displayImage}
                alt={selectedPost.topic}
                className="h-36 w-full object-cover"
              />
              <div className="flex gap-2 border-t border-gray-200/60 p-2 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-lg border border-gray-200/60 py-1.5 text-[10px] font-medium text-text-secondary-light hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Replace image
                </button>
                <button
                  type="button"
                  onClick={() => setPendingImageUrl(null)}
                  className="rounded-lg px-2 py-1.5 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Remove
                </button>
              </div>
              {!selectedPost.mediaUrl && pendingImageUrl && (
                <p className="bg-amber-50 px-2 py-1.5 text-[10px] text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                  Click Save Changes to add this image to Media and the calendar card.
                </p>
              )}
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              className="flex h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300/60 bg-gray-50 transition-colors hover:border-primary-light/50 hover:bg-primary-light/5 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-primary-dark/50"
            >
              <div className="flex flex-col items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <Upload size={18} />
                <span className="text-center text-[11px]">
                  Drop image, click to upload, or use AI Moodboard
                </span>
              </div>
            </div>
          )}

          {moodError && (
            <p className="mt-2 text-[10px] text-red-500">{moodError}</p>
          )}

          {selectedPost.visualInstructions && !displayImage && (
            <p className="mt-2 text-[11px] italic text-text-secondary-light dark:text-text-secondary-dark">
              {selectedPost.visualInstructions}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-style">Hook</label>
            <input
              type="text"
              value={draft.hook}
              onChange={set("hook")}
              className="input-style"
              placeholder="Opening line..."
            />
          </div>

          <div>
            <label className="label-style">Body / Caption</label>
            <textarea
              value={draft.body}
              onChange={set("body")}
              rows={4}
              className="input-style resize-none"
              placeholder="Main caption or script body..."
            />
          </div>

          <div>
            <label className="label-style flex items-center gap-1">
              <Hash size={10} /> Hashtags
            </label>
            <input
              type="text"
              value={draft.hashtags}
              onChange={set("hashtags")}
              className="input-style"
              placeholder="#EnglishTeacher #LearnEnglish"
            />
          </div>
        </div>
      </div>

      {error && <p className="px-5 pb-2 text-xs text-red-500">{error}</p>}

      <footer className="border-t border-gray-200/60 px-5 py-3 dark:border-white/5">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary w-full py-2"
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <>
              <Check size={14} /> Saved!
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </footer>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </section>
  );
}
