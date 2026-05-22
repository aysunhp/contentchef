import {
  CalendarDays,
  Image,
  MessageSquare,
  BarChart3,
  Settings,
  TrendingUp,
  LogOut,
} from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import CreateMenu from "../common/CreateMenu";

const NAV_ITEMS = [
  { id: "calendar", icon: CalendarDays, label: "Calendar" },
  { id: "media", icon: Image, label: "Media" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "trends", icon: TrendingUp, label: "Trend Hijacker" },
];

export default function Sidebar({ activeView = "calendar", onNavigate, onCreate, notesCount = 0, user, onLogout }) {
  const active = activeView;

  return (
    <aside className="flex h-screen w-[92px] flex-col items-center justify-between border-r border-gray-200/60 bg-surface-light py-6 dark:border-white/5 dark:bg-surface-dark">
      {/* Logo */}
      <div className="flex flex-col items-center gap-1">
        <img
          src="/image.png"
          alt="ContentChef"
          className="h-20 w-20 rounded-xl object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-2">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <div key={id} className="relative">
              <button
                onClick={() => onNavigate?.(id)}
                title={label}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${isActive
                    ? "border border-pastel-violet-border bg-pastel-violet text-pastel-violet-text"
                    : "text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
                  }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900">
                  {label}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute -left-[18px] h-5 w-1 rounded-r-full bg-pastel-violet-text" />
                )}
              </button>
              {/* Notification badge for messages with notes */}
              {id === "messages" && notesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {notesCount > 9 ? "9+" : notesCount}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-3">
        <CreateMenu onSelect={onCreate} />
        <ThemeToggle />
        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Logout"
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary-light transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:text-text-secondary-dark dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          <LogOut size={20} strokeWidth={1.8} />
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
