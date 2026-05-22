import {
  CalendarDays,
  Image,
  MessageSquare,
  BarChart3,
  Settings,
  ChefHat,
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
];

export default function Sidebar({ activeView = "calendar", onNavigate, onCreate, notesCount = 0, user, onLogout }) {
  const active = activeView;

  return (
    <aside className="flex h-screen w-[72px] flex-col items-center justify-between border-r border-gray-200/60 bg-surface-light py-6 dark:border-white/5 dark:bg-surface-dark">
      {/* Logo */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light/20 dark:bg-primary-dark/20">
          <ChefHat
            size={22}
            className="text-primary-light dark:text-primary-dark"
          />
        </div>
        <span className="mt-1 text-[9px] font-bold tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
          CHEF
        </span>
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
        {/* Profile Avatar */}
        <div className="relative group">
          <button className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary-light to-accent-light ring-2 ring-transparent transition-all hover:ring-primary-light/50 dark:from-primary-dark dark:to-accent-dark dark:hover:ring-primary-dark/50">
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </button>
          {/* Logout Tooltip */}
          <button
            onClick={onLogout}
            className="absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900 flex items-center gap-1.5"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
