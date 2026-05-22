import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Sparkles, FileText } from "lucide-react";
import { usePosts } from "../../context/PostContext";
import { postService } from "../../services/api";
import CalendarGrid from "./CalendarGrid";
import AIPromptBar from "../AI/AIPromptBar";
import NewPostModal from "../common/NewPostModal";
import TemplatesModal from "../common/TemplatesModal";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLATFORM_TITLES = {
  post: "New Post",
  instagram: "New Instagram Post",
  tiktok: "New TikTok Post",
};

const PLATFORM_HINTS = {
  instagram: "Optimize for Instagram best practices and aesthetic",
  tiktok: "Optimize for TikTok trends and engagement",
};

export default function CalendarBoard({
  newPostDate: externalNewPostDate,
  setNewPostDate: externalSetNewPostDate,
  platformType: externalPlatformType,
  setPlatformType: externalSetPlatformType,
}) {
  const { posts, setPosts, selectPost, isLoading, setLoading } = usePosts();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAIBar, setShowAIBar] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [internalNewPostDate, setInternalNewPostDate] = useState(null);
  const [internalPlatformType, setInternalPlatformType] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const newPostDate =
    externalNewPostDate !== undefined
      ? externalNewPostDate
      : internalNewPostDate;
  const platformType =
    externalPlatformType !== undefined
      ? externalPlatformType
      : internalPlatformType;

  const setNewPostDate = (date) => {
    if (externalSetNewPostDate) {
      externalSetNewPostDate(date);
    } else {
      setInternalNewPostDate(date);
    }
  };

  const setPlatformType = (type) => {
    if (externalSetPlatformType) {
      externalSetPlatformType(type);
    } else {
      setInternalPlatformType(type);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await postService.getAll();
        if (!cancelled) setPosts(res.data ?? []);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || "Failed to load posts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [setPosts, setLoading]);

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
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
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
            onClick={() => setShowTemplates(true)}
            className="btn-accent"
          >
            <FileText size={14} />
            Templates
          </button>
          <button
            onClick={() =>
              setNewPostDate(new Date().toLocaleDateString("en-CA"))
            }
            className="btn-primary"
          >
            <Plus size={14} />
            New Post
          </button>
          <button
            onClick={() => setShowAIBar((prev) => !prev)}
            className="btn-accent"
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

      {loadError && (
        <div className="mx-6 mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-300">
          {loadError}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Calendar Grid */}
      <CalendarGrid
        days={days}
        posts={posts}
        onSelectPost={selectPost}
        onNewPost={(date) => setNewPostDate(date)}
        isLoading={isLoading}
      />

      {newPostDate && (
        <NewPostModal
          defaultDate={newPostDate}
          platformType={platformType}
          platformHint={PLATFORM_HINTS[platformType]}
          modalTitle={PLATFORM_TITLES[platformType] || "New Post"}
          onClose={() => {
            setNewPostDate(null);
            setPlatformType(null);
          }}
        />
      )}

      {showTemplates && (
        <TemplatesModal
          onClose={() => setShowTemplates(false)}
          onUseTemplate={(template) => {
            // Populate the new post modal with template content
            setNewPostDate(new Date().toLocaleDateString("en-CA"));
            // Note: The template content can be injected via localStorage or context
            // For now, we'll just open the new post modal
          }}
        />
      )}
    </section>
  );
}
