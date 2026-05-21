import { forwardRef } from 'react';
import CalendarCard from './CalendarCard';

const CalendarCell = forwardRef(function CalendarCell(
  { date, isCurrentMonth, isToday, isDragOver, posts, onSelectPost, placeholder, ...props },
  ref,
) {
  const day = date.getDate();

  return (
    <div
      ref={ref}
      {...props}
      className={`min-h-[100px] rounded-xl border p-1.5 transition-colors ${
        isDragOver
          ? 'border-primary-light/50 bg-primary-light/5 dark:border-primary-dark/50 dark:bg-primary-dark/5'
          : 'border-transparent'
      } ${!isCurrentMonth ? 'opacity-30' : ''}`}
    >
      <span
        className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium ${
          isToday
            ? 'bg-primary-light text-white dark:bg-primary-dark dark:text-obsidian'
            : 'text-text-secondary-light dark:text-text-secondary-dark'
        }`}
      >
        {day}
      </span>

      <div className="flex flex-col gap-1">
        {posts.map((post, index) => (
          <CalendarCard
            key={post.id}
            post={post}
            index={index}
            onClick={() => onSelectPost(post)}
          />
        ))}
        {placeholder}
      </div>
    </div>
  );
});

export default CalendarCell;
