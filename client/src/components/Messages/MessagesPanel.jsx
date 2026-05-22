import { useState } from "react";
import { Trash2, Pin, Archive } from "lucide-react";

export default function MessagesPanel() {
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: "Campaign Ideas",
            content: "Brainstorm new campaign themes for Q2",
            category: "planning",
            pinned: true,
            createdAt: "2024-05-20",
        },
        {
            id: 2,
            title: "Follow-up: Client Feedback",
            content: "Incorporate feedback from last review session",
            category: "action",
            pinned: false,
            createdAt: "2024-05-21",
        },
        {
            id: 3,
            title: "Best Posting Times",
            content: "Monday-Friday 9AM, Wednesday 6PM for max engagement",
            category: "reference",
            pinned: true,
            createdAt: "2024-05-19",
        },
    ]);

    const [filter, setFilter] = useState("all");

    const filteredNotes =
        filter === "all"
            ? notes
            : filter === "pinned"
                ? notes.filter((n) => n.pinned)
                : notes.filter((n) => n.category === filter);

    const togglePin = (id) => {
        setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter((n) => n.id !== id));
    };

    const categoryColors = {
        planning: "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300",
        action: "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
        reference: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    };

    return (
        <section className="flex flex-1 flex-col overflow-hidden">
            <header className="border-b border-gray-200/60 px-6 py-4 dark:border-white/5">
                <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Messages & Notes
                </h1>
                <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Keep track of ideas, reminders, and action items
                </p>
            </header>

            <div className="flex gap-3 border-b border-gray-200/60 px-6 py-3 dark:border-white/5">
                {[
                    { label: "All", value: "all" },
                    { label: "Pinned", value: "pinned" },
                    { label: "Planning", value: "planning" },
                    { label: "Action", value: "action" },
                    { label: "Reference", value: "reference" },
                ].map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setFilter(item.value)}
                        className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${filter === item.value
                                ? "bg-pastel-violet text-pastel-violet-text"
                                : "text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="scrollbar-hidden flex-1 overflow-y-auto p-6">
                {filteredNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            No notes in this category
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                className="group rounded-2xl border border-gray-200/60 bg-surface-light p-4 transition-all hover:shadow-card-light dark:border-white/10 dark:bg-surface-dark dark:hover:shadow-card-dark"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                                {note.title}
                                            </h3>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[note.category]
                                                    }`}
                                            >
                                                {note.category}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                            {note.content}
                                        </p>
                                        <p className="mt-2 text-[10px] text-text-secondary-light/60 dark:text-text-secondary-dark/60">
                                            {note.createdAt}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => togglePin(note.id)}
                                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${note.pinned
                                                    ? "text-primary-light dark:text-primary-dark"
                                                    : "text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
                                                }`}
                                        >
                                            <Pin size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
