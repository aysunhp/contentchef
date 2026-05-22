import { useState, useRef, useEffect } from "react";
import { Plus, FileText, StickyNote, Instagram, Music2 } from "lucide-react";

const MENU_ITEMS = [
  { label: "New Post", icon: FileText, type: "post" },
  { label: "New Note", icon: StickyNote, type: "note" },
  { label: "Instagram Planner", icon: Instagram, type: "instagram" },
  { label: "TikTok Planner", icon: Music2, type: "tiktok" },
];

export default function CreateMenu({ onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (type) => {
    onSelect?.(type);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        title="Create"
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${open
            ? "border border-pastel-violet-border bg-pastel-violet text-pastel-violet-text"
            : "text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
          }`}
      >
        <Plus
          size={18}
          className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-full top-0 z-50 ml-3 w-48 overflow-hidden rounded-2xl border border-gray-200/60 bg-surface-light shadow-card-dark dark:border-white/10 dark:bg-surface-dark">
          <p className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
            Create
          </p>
          {MENU_ITEMS.map(({ label, icon: Icon, type }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-xs text-text-primary-light transition-colors hover:bg-gray-50 dark:text-text-primary-dark dark:hover:bg-white/5"
            >
              <Icon
                size={14}
                className="text-text-secondary-light dark:text-text-secondary-dark"
              />
              {label}
            </button>
          ))}
          <div className="h-2" />
        </div>
      )}
    </div>
  );
}
