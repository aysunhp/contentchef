import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';
import { postService } from '../../services/api';
import { usePosts } from '../../context/PostContext';
import { useFetch } from '../../hooks/useFetch';

const CATEGORIES = ['Education', 'Grammar Tips', 'Vocabulary', 'Speaking Practice', 'Motivation', 'General'];
const FORMATS = ['image', 'video'];
const PLATFORMS = ['Instagram', 'TikTok', 'General'];

export default function NewPostModal({ defaultDate, onClose }) {
  const { addPosts } = usePosts();
  const { isLoading, execute } = useFetch();

  const [form, setForm] = useState({
    date: defaultDate || new Date().toISOString().split('T')[0],
    topic: '',
    category: 'General',
    formatType: 'image',
    platform: 'General',
    hook: '',
    body: '',
  });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) return;

    const payload = {
      date: form.date,
      topic: form.topic,
      category: form.category,
      formatType: form.formatType,
      status: 'draft',
      visualInstructions: '',
      scriptOrCaption: {
        hook: form.hook,
        body: form.body,
        hashtags: [],
      },
    };

    const result = await execute(() => postService.create(payload));
    if (result?.data) {
      addPosts([result.data]);
      onClose();
    }
  };

  return (
    <Modal title="New Post" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="label-style">Date</label>
          <input type="date" value={form.date} onChange={set('date')} className="input-style" />
        </div>

        {/* Topic */}
        <div>
          <label className="label-style">Topic *</label>
          <input
            type="text"
            value={form.topic}
            onChange={set('topic')}
            placeholder="e.g. Common Grammar Mistakes"
            className="input-style"
            required
          />
        </div>

        {/* Category + Format row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-style">Category</label>
            <select value={form.category} onChange={set('category')} className="input-style">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-style">Format</label>
            <select value={form.formatType} onChange={set('formatType')} className="input-style">
              {FORMATS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Hook */}
        <div>
          <label className="label-style">Hook</label>
          <input
            type="text"
            value={form.hook}
            onChange={set('hook')}
            placeholder="Opening line that grabs attention"
            className="input-style"
          />
        </div>

        {/* Body */}
        <div>
          <label className="label-style">Caption / Body</label>
          <textarea
            value={form.body}
            onChange={set('body')}
            rows={3}
            placeholder="Main caption or script body"
            className="input-style resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-medium text-text-secondary-light transition-colors hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !form.topic.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-primary-light px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-primary-dark dark:text-obsidian"
          >
            {isLoading && <Loader2 size={12} className="animate-spin" />}
            Create Post
          </button>
        </div>
      </form>
    </Modal>
  );
}
