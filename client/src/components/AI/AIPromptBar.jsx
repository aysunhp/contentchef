import { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { postService } from "../../services/api";
import { generateContentPlan } from "../../services/puterAi";
import { usePosts } from "../../context/PostContext";
import { useFetch } from "../../hooks/useFetch";

export default function AIPromptBar({ onClose }) {
  const [prompt, setPrompt] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const { addPosts } = usePosts();
  const { isLoading, error, execute } = useFetch();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatusNote("");

    try {
      await execute(async () => {
        const { posts, source } = await generateContentPlan(prompt);

        if (source === "server") {
          addPosts(posts);
          setStatusNote(
            "Used built-in planner (Puter unavailable). Posts added.",
          );
        } else {
          const saved = [];
          for (const item of posts) {
            const res = await postService.create(item);
            if (res?.data) saved.push(res.data);
          }
          if (saved.length === 0) {
            throw new Error("No posts were saved");
          }
          addPosts(saved);
          setStatusNote("Generated with Puter AI.");
        }

        setPrompt("");
        onClose();
      });
    } catch {
      // error surfaced via useFetch
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="border-b border-gray-200/60 bg-primary-light/5 px-6 py-3 dark:border-white/5 dark:bg-primary-dark/5">
      <div className="flex items-center gap-2">
        <Sparkles
          size={16}
          className="shrink-0 text-primary-light dark:text-primary-dark"
        />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Describe your niche — e.g. "Vegan meal prep for busy parents, 7 TikTok ideas"'
          disabled={isLoading}
          className="flex-1 bg-transparent text-xs text-text-primary-light outline-none placeholder:text-text-secondary-light/60 dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark/60"
        />
        {isLoading ? (
          <Loader2
            size={16}
            className="animate-spin text-primary-light dark:text-primary-dark"
          />
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="btn-primary px-3 py-1"
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

      {statusNote && (
        <p className="mt-1 text-[9px] text-pastel-violet-text dark:text-primary-dark">
          {statusNote}
        </p>
      )}
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
