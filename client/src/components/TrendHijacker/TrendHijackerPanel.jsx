import { useState } from "react";
import { TrendingUp, Loader2, Sparkles, CalendarPlus, AlertCircle } from "lucide-react";
import { trendsService } from "../../services/api";
import NewPostModal from "../common/NewPostModal";

const NICHES = [
  "Fitness",
  "Finance",
  "Food",
  "Travel",
  "Fashion",
  "Tech",
  "Beauty",
  "Business",
  "Other",
];

const PLATFORMS = ["Instagram", "TikTok", "Both"];

const normalizePlatform = (p) => (p === "Both" ? "Instagram and TikTok" : p);

const parseUrgencyDays = (urgency) => {
  if (!urgency) return null;
  const match = String(urgency).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const urgencyStyle = (urgency) => {
  const days = parseUrgencyDays(urgency);
  if (days !== null && days < 2) {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  }
  if (days !== null && days < 5) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  }
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
};

const extractHashtags = (caption) => {
  if (!caption) return [];
  const matches = caption.match(/#[\wÀ-￿]+/g);
  return matches ? Array.from(new Set(matches)) : [];
};

const stripHashtags = (caption) => {
  if (!caption) return "";
  return caption.replace(/#[\wÀ-￿]+/g, "").replace(/\s{2,}/g, " ").trim();
};

export default function TrendHijackerPanel() {
  const [niche, setNiche] = useState("Fitness");
  const [platform, setPlatform] = useState("Instagram");
  const [phase, setPhase] = useState("idle"); // idle | scanning | generating | done | error
  const [trends, setTrends] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingIdea, setPendingIdea] = useState(null);

  const isLoading = phase === "scanning" || phase === "generating";
  const loadingLabel =
    phase === "scanning"
      ? "Scanning trends..."
      : phase === "generating"
      ? "Generating ideas..."
      : "";

  const handleRun = async () => {
    setErrorMessage("");
    setTrends([]);
    setIdeas([]);
    const platformValue = normalizePlatform(platform);

    try {
      setPhase("scanning");
      const trendsRes = await trendsService.find({ niche, platform: platformValue });
      const trendList = trendsRes?.data?.trends || [];
      if (trendList.length === 0) {
        throw new Error("No trends returned. Try a different niche.");
      }
      setTrends(trendList);

      setPhase("generating");
      const ideasRes = await trendsService.generate({
        trends: trendList,
        niche,
        platform: platformValue,
      });
      const ideaList = ideasRes?.data?.ideas || [];
      if (ideaList.length === 0) {
        throw new Error("No content ideas returned.");
      }
      setIdeas(ideaList);
      setPhase("done");
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setPhase("error");
    }
  };

  const handleAddToCalendar = (idea) => {
    const hashtags = extractHashtags(idea.caption);
    const bodyText = stripHashtags(idea.caption);
    setPendingIdea({
      topic: idea.trend,
      hook: idea.hook,
      body: bodyText,
      hashtags,
      category: niche,
    });
  };

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b border-gray-200/60 px-6 py-4 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-pastel-violet p-2 dark:bg-violet-900/30">
            <TrendingUp size={18} className="text-pastel-violet-text dark:text-violet-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Trend Hijacker
            </h1>
            <p className="mt-0.5 text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Find what's hot right now and turn it into on-brand content.
            </p>
          </div>
        </div>
      </header>

      <div className="scrollbar-hidden flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Controls */}
          <div className="rounded-2xl border border-gray-200/60 bg-surface-light/60 p-5 dark:border-white/10 dark:bg-surface-dark/40">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="label-style">Niche</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  disabled={isLoading}
                  className="input-style"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-style">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  disabled={isLoading}
                  className="input-style"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isLoading}
                  className="btn-primary w-full justify-center"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {isLoading ? loadingLabel : "Find Trends & Generate"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Phase indicator */}
          {isLoading && (
            <div className="rounded-2xl border border-pastel-violet-border bg-pastel-violet/40 px-5 py-4 dark:border-violet-700/40 dark:bg-violet-950/30">
              <div className="flex items-center gap-3">
                <Loader2
                  size={18}
                  className="animate-spin text-pastel-violet-text dark:text-violet-300"
                />
                <div>
                  <p className="text-sm font-semibold text-pastel-violet-text dark:text-violet-200">
                    {loadingLabel}
                  </p>
                  <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                    {phase === "scanning"
                      ? `Searching the web for ${niche.toLowerCase()} trends on ${platform.toLowerCase()}.`
                      : `Crafting ${niche.toLowerCase()} angles you can actually use.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results grid */}
          {ideas.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ideas.map((idea, i) => (
                <article
                  key={`${idea.trend}-${i}`}
                  className="flex flex-col justify-between rounded-2xl border border-gray-200/60 bg-surface-light p-5 shadow-card-light transition hover:shadow-card-dark dark:border-white/10 dark:bg-surface-dark dark:shadow-card-dark"
                >
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-pastel-violet px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-pastel-violet-text dark:bg-violet-900/40 dark:text-violet-200">
                      <TrendingUp size={11} />
                      {idea.trend}
                    </span>

                    <h3 className="text-base font-bold leading-snug text-text-primary-light dark:text-text-primary-dark">
                      {idea.hook}
                    </h3>

                    {idea.angle && (
                      <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                        <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                          Angle:{" "}
                        </span>
                        {idea.angle}
                      </p>
                    )}

                    {idea.caption && (
                      <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                        {idea.caption}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${urgencyStyle(idea.urgency)}`}
                    >
                      {idea.urgency || "post soon"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(idea)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-light px-3 py-1.5 text-[11px] font-semibold text-white transition hover:opacity-90 dark:bg-primary-dark"
                    >
                      <CalendarPlus size={12} />
                      Add to Calendar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Trends pills (context for the user once we have them) */}
          {trends.length > 0 && phase !== "scanning" && (
            <div className="rounded-2xl border border-gray-200/60 bg-surface-light/40 p-5 dark:border-white/10 dark:bg-surface-dark/30">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                Trends we hijacked
              </h2>
              <ul className="space-y-2">
                {trends.map((t, i) => (
                  <li
                    key={`${t.name}-${i}`}
                    className="rounded-lg border border-gray-200/60 px-3 py-2 text-xs dark:border-white/10"
                  >
                    <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {t.name}
                    </div>
                    <div className="mt-1 text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                      {t.why_trending}{" "}
                      {t.window && (
                        <span className="opacity-70">· hot for {t.window}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {phase === "idle" && (
            <div className="rounded-2xl border border-dashed border-gray-300/60 bg-surface-light/40 px-5 py-10 text-center dark:border-white/10 dark:bg-surface-dark/30">
              <TrendingUp
                size={28}
                className="mx-auto mb-3 text-text-secondary-light dark:text-text-secondary-dark"
              />
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                Hijack what's trending
              </p>
              <p className="mx-auto mt-1 max-w-md text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Pick a niche and platform, hit "Find Trends & Generate", and ContentChef
                will scan live trends and turn them into ready-to-post ideas.
              </p>
            </div>
          )}
        </div>
      </div>

      {pendingIdea && (
        <NewPostModal
          defaultDate={new Date().toLocaleDateString("en-CA")}
          modalTitle="Add Trend Idea to Calendar"
          platformType={platform === "Both" ? null : platform.toLowerCase()}
          defaults={pendingIdea}
          onClose={() => setPendingIdea(null)}
        />
      )}
    </section>
  );
}
