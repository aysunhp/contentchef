import { useEffect, useRef } from 'react';
import { Eye, Trash2, CheckCircle, Clock, FileEdit } from 'lucide-react';

const STATUS_ITEMS = [
  { label: 'Draft', value: 'draft', icon: FileEdit },
  { label: 'In Review', value: 'review', icon: Clock },
  { label: 'Published', value: 'published', icon: CheckCircle },
];

export default function ContextMenu({ x, y, post, onClose, onSelect, onDelete }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Adjust position so menu stays within viewport
  const style = {
    top: Math.min(y, window.innerHeight - 200),
    left: Math.min(x, window.innerWidth - 200),
  };

  return (
    <div
      ref={ref}
      style={style}
      className="fixed z-50 w-48 overflow-hidden rounded-2xl border border-gray-200/60 bg-surface-light shadow-card-dark dark:border-white/10 dark:bg-surface-dark"
    >
      <div className="p-1">
        <button
          onClick={() => { onSelect(post); onClose(); }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary-light transition-colors hover:bg-gray-100 dark:text-text-primary-dark dark:hover:bg-white/5"
        >
          <Eye size={13} />
          Open in Kitchen
        </button>
      </div>

      <div className="border-t border-gray-200/60 p-1 dark:border-white/5">
        <p className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
          Change Status
        </p>
        {STATUS_ITEMS.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => { onSelect({ ...post, _changeStatus: value }); onClose(); }}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-white/5 ${
              post.status === value
                ? 'font-semibold text-primary-light dark:text-primary-dark'
                : 'text-text-primary-light dark:text-text-primary-dark'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200/60 p-1 dark:border-white/5">
        <button
          onClick={() => { onDelete(post.id); onClose(); }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={13} />
          Delete Post
        </button>
      </div>
    </div>
  );
}
