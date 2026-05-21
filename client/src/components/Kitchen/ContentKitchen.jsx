import { X, Upload, Sparkles, Video, ImageIcon, Hash } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { STATUS_COLORS, FORMAT_LABELS } from '../../constants/theme';

export default function ContentKitchen() {
  const { selectedPost, selectPost } = usePosts();

  if (!selectedPost) {
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

  const statusStyle = STATUS_COLORS[selectedPost.status] || STATUS_COLORS.draft;
  const caption = selectedPost.scriptOrCaption || {};

  return (
    <section className="flex w-[380px] flex-col overflow-hidden border-l border-gray-200/60 bg-surface-light/50 dark:border-white/5 dark:bg-surface-dark/50">
      {/* Kitchen Header */}
      <header className="flex items-center justify-between border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
        <div>
          <h2 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            Content Kitchen
          </h2>
          <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
            {selectedPost.date}
          </p>
        </div>
        <button
          onClick={() => selectPost(null)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary-light transition-colors hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
        >
          <X size={16} />
        </button>
      </header>

      <div className="scrollbar-hidden flex-1 overflow-y-auto px-5 py-4">
        {/* Status & Format Badges */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`rounded-lg px-2 py-1 text-[10px] font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}
          >
            {selectedPost.status}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-medium text-text-secondary-light dark:bg-white/5 dark:text-text-secondary-dark">
            {selectedPost.formatType === 'video' ? <Video size={10} /> : <ImageIcon size={10} />}
            {FORMAT_LABELS[selectedPost.formatType]}
          </span>
          <span className="rounded-lg bg-primary-light/10 px-2 py-1 text-[10px] font-medium text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
            {selectedPost.category}
          </span>
        </div>

        {/* Topic */}
        <h3 className="mb-4 text-base font-bold text-text-primary-light dark:text-text-primary-dark">
          {selectedPost.topic}
        </h3>

        {/* Visual Moodboard Section */}
        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
            Visual Concept
          </label>
          <div className="flex h-36 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300/60 bg-gray-50 transition-colors hover:border-primary-light/50 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-primary-dark/50">
            <div className="flex flex-col items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
              <Upload size={20} />
              <span className="text-[11px]">Drop visual or generate with AI</span>
            </div>
          </div>
          {selectedPost.visualInstructions && (
            <p className="mt-2 text-[11px] italic text-text-secondary-light dark:text-text-secondary-dark">
              {selectedPost.visualInstructions}
            </p>
          )}
        </div>

        {/* Script & Caption */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
              Hook
            </label>
            <div className="rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-text-primary-light dark:bg-white/[0.03] dark:text-text-primary-dark">
              {caption.hook || 'No hook defined'}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
              Body / Caption
            </label>
            <div className="rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-text-primary-light dark:bg-white/[0.03] dark:text-text-primary-dark">
              {caption.body || 'No caption defined'}
            </div>
          </div>

          {caption.hashtags?.length > 0 && (
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                <Hash size={10} /> Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {caption.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-primary-light/10 px-2 py-0.5 text-[10px] font-medium text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
