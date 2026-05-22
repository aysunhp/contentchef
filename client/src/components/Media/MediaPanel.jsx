import { useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { useMedia } from "../../context/MediaContext";
import { usePosts } from "../../context/PostContext";

export default function MediaPanel({ onOpenPost }) {
  const { media, fetchMedia } = useMedia();
  const { posts } = usePosts();

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const postById = Object.fromEntries(posts.map((p) => [p.id, p]));

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b border-gray-200/60 px-6 py-4 dark:border-white/5">
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Media Library
        </h1>
        <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Images saved from posts and moodboards appear here.
        </p>
      </header>

      <div className="scrollbar-hidden flex-1 overflow-y-auto p-6">
        {media.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <ImageIcon
              size={40}
              className="text-text-secondary-light dark:text-text-secondary-dark"
            />
            <p className="max-w-xs text-sm text-text-secondary-light dark:text-text-secondary-dark">
              No media yet. Generate an AI moodboard in Content Kitchen and click Save
              Changes to add it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item) => {
              const linkedPost = item.postId ? postById[item.postId] : null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => linkedPost && onOpenPost?.(linkedPost)}
                  className="group overflow-hidden rounded-2xl border border-gray-200/60 bg-surface-light text-left transition-all hover:shadow-card-light dark:border-white/10 dark:bg-surface-dark dark:hover:shadow-card-dark"
                >
                  <img
                    src={item.url}
                    alt={item.topic}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-2.5">
                    <p className="truncate text-xs font-medium text-text-primary-light dark:text-text-primary-dark">
                      {item.topic}
                    </p>
                    {linkedPost && (
                      <p className="mt-0.5 text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                        {linkedPost.date} · click to open
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
