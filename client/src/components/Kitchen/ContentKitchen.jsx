import { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Video, ImageIcon, Hash, Check, Loader2, Trash2, Wand2 } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { postService, aiService } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import { STATUS_COLORS, FORMAT_LABELS } from '../../constants/theme';
import ConfirmModal from '../common/ConfirmModal';

const STATUSES = ['draft', 'review', 'published'];

export default function ContentKitchen() {
  const { selectedPost, selectPost, updatePost, deletePost } = usePosts();
  const { isLoading, execute } = useFetch();
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);
  const [moodboard, setMoodboard] = useState(null);
  const [moodLoading, setMoodLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    console.log('[ContentKitchen] selectedPost changed:', selectedPost);
    if (selectedPost) {
      setDraft({
        status: selectedPost.status,
        hook: selectedPost.scriptOrCaption?.hook || '',
        body: selectedPost.scriptOrCaption?.body || '',
        hashtags: (selectedPost.scriptOrCaption?.hashtags || []).join(' '),
      });
      setSaved(false);
      setMoodboard(null);
    }
  }, [selectedPost]);

  const handleGenerateMoodboard = async () => {
    setMoodLoading(true);
    try {
      const result = await aiService.generateMoodboard(selectedPost.topic);
      if (result?.data) setMoodboard(result.data);
    } finally {
      setMoodLoading(false);
    }
  };

  if (!selectedPost || !draft) {
    return (
      <section className="hidden w-[380px] flex-col items-center justify-center bg-surface-light/50 dark:bg-surface-dark/50 lg:flex">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light/10 dark:bg-primary-dark/10">
            <Sparkles size={28} className="text-primary-light dark:text-primary-dark" />
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

  const handleSave = async () => {
    const updates = {
      status: draft.status,
      scriptOrCaption: {
        hook: draft.hook,
        body: draft.body,
        hashtags: draft.hashtags.split(/\s+/).filter((t) => t.startsWith('#')),
      },
    };
    const result = await execute(() => postService.update(selectedPost.id, updates));
    if (result?.data) {
      updatePost(result.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await execute(() => postService.delete(selectedPost.id));
    deletePost(selectedPost.id);
    setShowDeleteModal(false);
    selectPost(null);
  };

  const statusStyle = STATUS_COLORS[draft.status] || STATUS_COLORS.draft;

  return (
    <section className="animate-slide-in flex w-[380px] flex-col overflow-hidden border-l border-gray-200/60 bg-surface-light/50 dark:border-white/5 dark:bg-surface-dark/50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
        <div>
          <h2 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            Content Kitchen
          </h2>
          <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
            {selectedPost.date}
          </p>
        </div>
        {/* Buttons */}
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
        {/* Status Selector */}
        <div className="mb-4">
          <label className="label-style">Status</label>
          <div className="flex gap-1.5">
            {STATUSES.map((s) => {
              const st = STATUS_COLORS[s];
              return (
                <button
                  key={s}
                  onClick={() => setDraft((prev) => ({ ...prev, status: s }))}
                  className={`rounded-lg px-3 py-1 text-[10px] font-semibold uppercase transition-all ${st.bg} ${st.text} ${draft.status === s ? 'ring-2 ring-offset-1 ring-current' : 'opacity-50 hover:opacity-80'
                    }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format & Category */}
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-medium text-text-secondary-light dark:bg-white/5 dark:text-text-secondary-dark">
            {selectedPost.formatType === 'video' ? <Video size={10} /> : <ImageIcon size={10} />}
            {FORMAT_LABELS[selectedPost.formatType]}
          </span>
          <span className="rounded-lg bg-primary-light/10 px-2 py-1 text-[10px] font-medium text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
            {selectedPost.category}
          </span>
        </div>

        {/* Topic */}
        <h3 className="mb-5 text-base font-bold text-text-primary-light dark:text-text-primary-dark">
          {selectedPost.topic}
        </h3>

        {/* Visual Concept / AI Moodboard */}
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="label-style">Visual Concept</label>
            <button
              onClick={handleGenerateMoodboard}
              disabled={moodLoading}
              className="flex items-center gap-1 rounded-lg bg-primary-light/10 px-2 py-1 text-[10px] font-medium text-primary-light transition-colors hover:bg-primary-light/20 disabled:opacity-50 dark:bg-primary-dark/10 dark:text-primary-dark dark:hover:bg-primary-dark/20"
            >
              {moodLoading ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
              AI Moodboard
            </button>
          </div>
          {/* Moodboard Display */}
          {moodboard ? (
            <div className="overflow-hidden rounded-2xl">
              <img
                src={moodboard.imageUrl}
                alt={moodboard.topic}
                className="h-36 w-full object-cover"
              />
              <p className="mt-1 text-[10px] italic text-text-secondary-light dark:text-text-secondary-dark">
                Style: {moodboard.style}
              </p>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300/60 bg-gray-50 transition-colors hover:border-primary-light/50 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-primary-dark/50">
              <div className="flex flex-col items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <Upload size={18} />
                <span className="text-[11px]">Drop visual or click AI Moodboard</span>
              </div>
            </div>
          )}

          {selectedPost.visualInstructions && !moodboard && (
            <p className="mt-2 text-[11px] italic text-text-secondary-light dark:text-text-secondary-dark">
              {selectedPost.visualInstructions}
            </p>
          )}
        </div>

        {/* Editable Script */}
        <div className="space-y-4">
          <div>
            <label className="label-style">Hook</label>
            <input
              type="text"
              value={draft.hook}
              onChange={set('hook')}
              className="input-style"
              placeholder="Opening line..."
            />
          </div>

          <div>
            <label className="label-style">Body / Caption</label>
            <textarea
              value={draft.body}
              onChange={set('body')}
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
              onChange={set('hashtags')}
              className="input-style"
              placeholder="#EnglishTeacher #LearnEnglish"
            />
          </div>
        </div>
      </div>

      {/* Save Footer */}
      <footer className="border-t border-gray-200/60 px-5 py-3 dark:border-white/5">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-light py-2 text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 dark:bg-primary-dark dark:text-obsidian"
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <><Check size={14} /> Saved!</>
          ) : (
            'Save Changes'
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
