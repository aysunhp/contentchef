import { useState } from "react";
import { Copy, Trash2, Plus } from "lucide-react";
import Modal from "./Modal";

const DEFAULT_TEMPLATES = [
    {
        id: 1,
        name: "Quick Tip",
        hook: "Here's a quick tip that will save you time...",
        body: "This simple trick works for almost everyone. Try it this week!",
        hashtags: ["#ProTip", "#HelpfulContent"],
    },
    {
        id: 2,
        name: "Story Time",
        hook: "Let me share what happened yesterday...",
        body: "The lesson I learned from this experience was... I hope this helps!",
        hashtags: ["#StorytimeWithMe", "#Lessons"],
    },
    {
        id: 3,
        name: "Question & Answer",
        hook: "Got a question in my DMs that I want to answer publicly...",
        body: "Great question! The answer is... Would love to hear your thoughts too!",
        hashtags: ["#AMA", "#CommunityFirst"],
    },
    {
        id: 4,
        name: "Behind the Scenes",
        hook: "Here's what most people don't see...",
        body: "The reality behind the scenes is... This is what it really takes.",
        hashtags: ["#BehindTheScenes", "#RealTalk"],
    },
];

export default function TemplatesModal({ onClose, onUseTemplate }) {
    const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
    const [showNewTemplate, setShowNewTemplate] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: "",
        hook: "",
        body: "",
        hashtags: "",
    });

    const handleAddTemplate = () => {
        if (!newTemplate.name.trim()) return;

        const template = {
            id: Date.now(),
            name: newTemplate.name,
            hook: newTemplate.hook,
            body: newTemplate.body,
            hashtags: newTemplate.hashtags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t),
        };

        setTemplates([...templates, template]);
        setNewTemplate({ name: "", hook: "", body: "", hashtags: "" });
        setShowNewTemplate(false);
    };

    const handleDelete = (id) => {
        setTemplates(templates.filter((t) => t.id !== id));
    };

    return (
        <Modal title="Content Templates" onClose={onClose}>
            <div className="max-h-96 space-y-2 overflow-y-auto">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="group rounded-lg border border-gray-200/60 p-3 dark:border-white/10"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                                {template.name}
                            </h3>
                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                    onClick={() => onUseTemplate(template)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-pastel-violet-text hover:bg-pastel-violet/20"
                                    title="Use template"
                                >
                                    <Copy size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Delete template"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                            {template.hook}
                        </p>
                        <div className="mt-2 flex gap-1">
                            {template.hashtags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[9px] text-text-secondary-light dark:bg-white/5 dark:text-text-secondary-dark"
                                >
                                    {tag}
                                </span>
                            ))}
                            {template.hashtags.length > 2 && (
                                <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[9px] text-text-secondary-light dark:bg-white/5 dark:text-text-secondary-dark">
                                    +{template.hashtags.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showNewTemplate && (
                <div className="mt-4 space-y-3 rounded-lg border border-gray-200/60 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/[0.02]">
                    <input
                        type="text"
                        placeholder="Template name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        className="input-style text-xs"
                    />
                    <textarea
                        placeholder="Hook (opening line)"
                        value={newTemplate.hook}
                        onChange={(e) => setNewTemplate({ ...newTemplate, hook: e.target.value })}
                        rows={2}
                        className="input-style resize-none text-xs"
                    />
                    <textarea
                        placeholder="Body content"
                        value={newTemplate.body}
                        onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                        rows={2}
                        className="input-style resize-none text-xs"
                    />
                    <input
                        type="text"
                        placeholder="Hashtags (comma-separated)"
                        value={newTemplate.hashtags}
                        onChange={(e) => setNewTemplate({ ...newTemplate, hashtags: e.target.value })}
                        className="input-style text-xs"
                    />
                </div>
            )}

            <div className="mt-4 flex gap-2">
                {!showNewTemplate && (
                    <button
                        onClick={() => setShowNewTemplate(true)}
                        className="btn-accent flex items-center gap-1"
                    >
                        <Plus size={12} />
                        Create Template
                    </button>
                )}
                {showNewTemplate && (
                    <>
                        <button
                            onClick={handleAddTemplate}
                            className="btn-primary flex-1"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setShowNewTemplate(false);
                                setNewTemplate({ name: "", hook: "", body: "", hashtags: "" });
                            }}
                            className="rounded-lg border border-gray-200/60 px-3 py-2 text-xs font-medium text-text-secondary-light hover:bg-gray-100 dark:border-white/10 dark:text-text-secondary-dark dark:hover:bg-white/5"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
}
