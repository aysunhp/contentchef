import { useState } from 'react';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import Modal from './Modal';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user, data.data.token);
        onClose();
      } else {
        setError(data.error?.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Welcome Back" onClose={onClose} hideClose>
      <form onSubmit={handleSubmit} className="space-y-5">
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
                <LogIn size={14} />
                Sign In
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-pastel-violet-text hover:underline transition-colors"
          >
            Sign up
          </button>
        </p>
      </form>
    </Modal>
  );
}
