import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { postService } from '../../services/api';
import CalendarGrid from './CalendarGrid';
import AIPromptBar from '../AI/AIPromptBar';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarBoard() {
  const { posts, setPosts, selectPost, isLoading } = usePosts();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAIBar, setShowAIBar] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    postService
      .getAll()
      .then((res) => setPosts(res.data))
      .catch(() => {});
  }, [setPosts]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7; // Monday-based
    const days = [];

    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
      }
    }
    return days;
  };

  const days = getDaysInMonth();

  return (
    <section className="flex flex-1 flex-col overflow-hidden border-r border-gray-200/60 dark:border-white/5">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200/60 px-6 py-4 dark:border-white/5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {MONTHS[month]} {year}
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary-light transition-colors hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToday}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-text-secondary-light transition-colors hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary-light transition-colors hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIBar((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl bg-primary-light/10 px-3 py-2 text-xs font-medium text-primary-light transition-all hover:bg-primary-light/20 dark:bg-primary-dark/10 dark:text-primary-dark dark:hover:bg-primary-dark/20"
          >
            <Sparkles size={14} />
            AI Generate
          </button>
        </div>
      </header>

      {/* AI Prompt Bar */}
      {showAIBar && <AIPromptBar onClose={() => setShowAIBar(false)} />}

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-gray-200/60 px-6 dark:border-white/5">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        days={days}
        posts={posts}
        onSelectPost={selectPost}
        isLoading={isLoading}
      />
    </section>
  );
}
