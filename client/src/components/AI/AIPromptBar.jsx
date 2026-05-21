import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { aiService } from '../../services/api';
import { usePosts } from '../../context/PostContext';
import { useFetch } from '../../hooks/useFetch';

export default function AIPromptBar({ onClose }) {
  const [prompt, setPrompt] = useState('');
  const { addPosts } = usePosts();
  const { isLoading, error, execute } = useFetch();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const result = await execute(() => aiService.generatePlan(prompt));
    if (result?.data) {
      addPosts(result.data);
      setPrompt('');
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="border-b border-gray-200/60 bg-primary-light/5 px-6 py-3 dark:border-white/5 dark:bg-primary-dark/5">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="shrink-0 text-primary-light dark:text-primary-dark" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "I am an English teacher, generate a week of content..."'
          disabled={isLoading}
          className="flex-1 bg-transparent text-xs text-text-primary-light outline-none placeholder:text-text-secondary-light/60 dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark/60"
        />
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-primary-light dark:text-primary-dark" />
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="rounded-lg bg-primary-light px-3 py-1 text-[11px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-primary-dark dark:text-obsidian"
          >
            Generate
          </button>
        )}
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-text-secondary-light hover:bg-gray-200/50 dark:text-text-secondary-dark dark:hover:bg-white/5"
        >
          <X size={14} />
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-[10px] text-red-500">{error}</p>
      )}
    </div>
  );
}
