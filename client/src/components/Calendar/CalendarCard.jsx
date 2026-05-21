import { Draggable } from '@hello-pangea/dnd';
import { Video, ImageIcon } from 'lucide-react';
import { STATUS_COLORS } from '../../constants/theme';

export default function CalendarCard({ post, index, onClick }) {
  const statusStyle = STATUS_COLORS[post.status] || STATUS_COLORS.draft;

  return (
    <Draggable draggableId={post.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`cursor-pointer rounded-xl border border-gray-200/40 bg-surface-light px-2 py-1.5 transition-all dark:border-white/5 dark:bg-surface-dark ${
            snapshot.isDragging
              ? 'rotate-2 scale-105 shadow-card-dark'
              : 'hover:rotate-1 hover:shadow-card-light dark:hover:shadow-card-dark'
          }`}
        >
          <div className="flex items-center gap-1">
            {post.formatType === 'video' ? (
              <Video size={10} className="text-primary-light dark:text-primary-dark" />
            ) : (
              <ImageIcon size={10} className="text-accent-light dark:text-accent-dark" />
            )}
            <span className="truncate text-[10px] font-medium text-text-primary-light dark:text-text-primary-dark">
              {post.topic}
            </span>
          </div>
          <span
            className={`mt-0.5 inline-block rounded-md px-1.5 py-0.5 text-[8px] font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}
          >
            {post.status}
          </span>
        </div>
      )}
    </Draggable>
  );
}
