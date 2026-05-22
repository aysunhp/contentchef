import { useState } from 'react';
import { Loader2, UserPlus, Mail, Lock, User } from 'lucide-react';
import Modal from './Modal';

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => onSwitchToLogin(), 1500);
      } else {
        setError(data.error?.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Create Account" onClose={onClose} hideClose>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="label-style">Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="input-style pl-10"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="label-style">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="input-style pl-10"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="label-style">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-style pl-10"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="label-style">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-style pl-10"
              required
            />
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600 dark:bg-green-950/30 dark:text-green-400">
            <span>✓</span>
            Account created! Redirecting to login...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <UserPlus size={14} />
                Sign Up
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-pastel-violet-text hover:underline transition-colors"
          >
            Sign in
          </button>
        </p>
      </form>
    </Modal>
  );
}
