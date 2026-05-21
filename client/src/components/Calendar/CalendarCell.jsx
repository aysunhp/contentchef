import { forwardRef } from 'react';
import { Plus } from 'lucide-react';
import CalendarCard from './CalendarCard';

const CalendarCell = forwardRef(function CalendarCell(
  { date, isCurrentMonth, isToday, isDragOver, posts, onSelectPost, onNewPost, onContextMenu, placeholder, ...props },
  ref,
) {
  const dateStr = date.toISOString().split('T')[0];
  const day = date.getDate();

  return (
    <div
      ref={ref}
      {...props}
      className={`group min-h-[100px] rounded-xl border p-1.5 transition-colors ${
        isDragOver
          ? 'border-primary-light/50 bg-primary-light/5 dark:border-primary-dark/50 dark:bg-primary-dark/5'
          : 'border-transparent hover:border-gray-200/60 dark:hover:border-white/5'
      } ${!isCurrentMonth ? 'opacity-30' : ''}`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium ${
            isToday
              ? 'bg-primary-light text-white dark:bg-primary-dark dark:text-obsidian'
              : 'text-text-secondary-light dark:text-text-secondary-dark'
          }`}
        >
          {day}
        </span>
        {isCurrentMonth && onNewPost && (
          <button
            onClick={() => onNewPost(dateStr)}
            className="flex h-5 w-5 items-center justify-center rounded-md text-text-secondary-light opacity-0 transition-all group-hover:opacity-100 hover:bg-primary-light/20 hover:text-primary-light dark:text-text-secondary-dark dark:hover:bg-primary-dark/20 dark:hover:text-primary-dark"
          >
            <Plus size={10} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {posts.map((post, index) => (
          <CalendarCard
            key={post.id}
            post={post}
            index={index}
            onClick={() => onSelectPost(post)}
            onContextMenu={onContextMenu}
          />
        ))}
        {placeholder}
      </div>
    </div>
  );
});

export default CalendarCell;
