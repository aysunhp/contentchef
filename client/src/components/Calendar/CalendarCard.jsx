import { Draggable } from "@hello-pangea/dnd";
import { Video, ImageIcon, Clock3 } from "lucide-react";
import { STATUS_COLORS } from "../../constants/theme";

const BEST_TIME_HOURS = { instagram: "6pm", tiktok: "7pm", general: "9am" };

const getPlatformHint = (category) => {
  if (category?.toLowerCase().includes("tiktok")) return BEST_TIME_HOURS.tiktok;
  if (category?.toLowerCase().includes("instagram"))
    return BEST_TIME_HOURS.instagram;
  return null;
};

export default function CalendarCard({ post, index, onClick, onContextMenu }) {
  const statusStyle = STATUS_COLORS[post.status] || STATUS_COLORS.draft;
  const bestTime = getPlatformHint(post.category);
  const hasMedia = Boolean(post.mediaUrl);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu?.({ x: e.clientX, y: e.clientY, post });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(post);
  };

  return (
    <Draggable draggableId={post.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          className={`cursor-pointer overflow-hidden rounded-xl border border-gray-200/40 bg-surface-light transition-all dark:border-white/5 dark:bg-surface-dark ${
            snapshot.isDragging
              ? "rotate-2 scale-105 shadow-card-dark ring-2 ring-primary-light/30 dark:ring-primary-dark/30"
              : "hover:rotate-1 hover:shadow-card-light dark:hover:shadow-card-dark"
          }`}
        >
          {hasMedia && (
            <img
              src={post.mediaUrl}
              alt=""
              className="h-10 w-full object-cover"
            />
          )}

          <div className={`px-2 ${hasMedia ? "py-1" : "py-1.5"}`}>
            <div className="flex items-center gap-1">
              {post.formatType === "video" ? (
                <Video
                  size={10}
                  className="shrink-0 text-primary-light dark:text-primary-dark"
                />
              ) : (
                <ImageIcon
                  size={10}
                  className="shrink-0 text-accent-light dark:text-accent-dark"
                />
              )}
              <span className="truncate text-[10px] font-medium text-text-primary-light dark:text-text-primary-dark">
                {post.topic}
              </span>
            </div>

            <div className="mt-0.5 flex items-center justify-between gap-1">
              <span
                className={`inline-block rounded-md px-1.5 py-0.5 text-[8px] font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}
              >
                {post.status === "review" ? "⚡ Review" : post.status}
              </span>
              {bestTime && (
                <span className="flex items-center gap-0.5 text-[8px] text-text-secondary-light dark:text-text-secondary-dark">
                  <Clock3 size={8} />
                  {bestTime}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
