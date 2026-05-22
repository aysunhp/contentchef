import { useState, useEffect } from "react";
import { Save, Bell, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../common/ConfirmModal";
import Modal from "../common/Modal";

export default function SettingsPanel() {
    const { user, token, logout, updateUser } = useAuth();

    const [settings, setSettings] = useState({
        username: "",
        email: "",
        bio: "",
        notifications: {
            postReminders: true,
            engagementAlerts: true,
            weeklyDigest: true,
            platformNotifications: false,
        },
        theme: "auto",
        language: "english",
        defaultPostFormat: "image",
        defaultPostStatus: "draft",
    });

    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    const resetPasswordForm = () => {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError('');
        setPasswordSuccess('');
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            setPasswordError('All fields are required');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New password and confirmation do not match');
            return;
        }

        setChangingPassword(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${apiUrl}/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPasswordSuccess('Password changed successfully');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    resetPasswordForm();
                }, 1200);
            } else {
                setPasswordError(data.error?.message || 'Failed to change password');
            }
        } catch {
            setPasswordError('Network error. Please try again.');
        } finally {
            setChangingPassword(false);
        }
    };

    useEffect(() => {
        if (user) {
            setSettings((prev) => ({
                ...prev,
                username: user.name || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    const handleChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleNotificationChange = (key) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key],
            },
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError('');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${apiUrl}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: settings.username,
                    bio: settings.bio,
                }),
            });
            const data = await response.json();
            if (data.success) {
                updateUser(data.data.user);
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                setSaveError(data.error?.message || 'Failed to save');
            }
        } catch {
            setSaveError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Removed profile reset functionality per UX request

    return (
        <section className="flex flex-1 flex-col overflow-hidden">
            <header className="border-b border-gray-200/60 px-6 py-4 dark:border-white/5">
                <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Settings
                </h1>
                <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Manage your account and preferences
                </p>
            </header>

            <div className="scrollbar-hidden flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Profile Section */}
                    <div className="rounded-2xl border border-gray-200/60 p-6 dark:border-white/10">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">
                                <span className="text-xl font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    Profile
                                </h2>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    Update your public profile information
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="label-style">Username</label>
                                <input
                                    type="text"
                                    value={settings.username}
                                    onChange={(e) => handleChange("username", e.target.value)}
                                    className="input-style"
                                />
                            </div>

                            <div>
                                <label className="label-style">Email</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="input-style"
                                />
                            </div>

                            <div>
                                <label className="label-style">Bio</label>
                                <textarea
                                    value={settings.bio}
                                    onChange={(e) => handleChange("bio", e.target.value)}
                                    rows={3}
                                    className="input-style resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="rounded-2xl border border-gray-200/60 p-6 dark:border-white/10">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                                <Bell size={18} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    Notifications
                                </h2>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    Choose what notifications you receive
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(settings.notifications).map(([key, value]) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-3 rounded-lg border border-gray-200/60 p-3 cursor-pointer transition-all hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
                                >
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={() => handleNotificationChange(key)}
                                        className="h-4 w-4 rounded accent-primary-light dark:accent-primary-dark"
                                    />
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                        </p>
                                        <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                                            {key === "postReminders" && "Get reminded before posting"}
                                            {key === "engagementAlerts" && "Alerts when posts get comments/likes"}
                                            {key === "weeklyDigest" && "Weekly summary of your performance"}
                                            {key === "platformNotifications" && "Notifications from social platforms"}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    

                    {/* Security Section */}
                    <div className="rounded-2xl border border-gray-200/60 p-6 dark:border-white/10">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                                <Lock size={18} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    Security
                                </h2>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    Account security options
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    resetPasswordForm();
                                    setShowPasswordModal(true);
                                }}
                                className="w-full rounded-lg border border-gray-200/60 px-4 py-2 text-xs font-medium text-text-primary-light transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-text-primary-dark dark:hover:bg-white/5"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={() => setShowDeleteAccountModal(true)}
                                className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

                {deleteError && (
                    <div className="mx-6 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                        {deleteError}
                    </div>
                )}

                {showPasswordModal && (
                    <Modal
                        title="Change Password"
                        onClose={() => {
                            setShowPasswordModal(false);
                            resetPasswordForm();
                        }}
                    >
                        <div className="space-y-3">
                            <div>
                                <label className="label-style">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                                    className="input-style"
                                    autoComplete="current-password"
                                />
                            </div>
                            <div>
                                <label className="label-style">New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                                    className="input-style"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div>
                                <label className="label-style">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                                    className="input-style"
                                    autoComplete="new-password"
                                />
                            </div>

                            {passwordError && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600 dark:bg-green-950/30 dark:text-green-400">
                                    {passwordSuccess}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        resetPasswordForm();
                                    }}
                                    className="rounded-lg border border-gray-200/60 px-4 py-2 text-xs font-medium text-text-secondary-light hover:bg-gray-50 dark:border-white/10 dark:text-text-secondary-dark dark:hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={changingPassword}
                                    className="btn-primary"
                                >
                                    {changingPassword ? 'Saving...' : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {showDeleteAccountModal && (
                    <ConfirmModal
                        title="Delete Account"
                        message="Are you sure you want to delete your account? This action cannot be undone."
                        onConfirm={async () => {
                            setDeleteError('');
                            try {
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
                                const res = await fetch(`${apiUrl}/auth/account`, {
                                    method: 'DELETE',
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                                const data = await res.json();
                                if (data.success) {
                                    setShowDeleteAccountModal(false);
                                    logout();
                                } else {
                                    setDeleteError(data.error?.message || 'Failed to delete account');
                                }
                            } catch (err) {
                                setDeleteError('Network error. Please try again.');
                            }
                        }}
                        onClose={() => setShowDeleteAccountModal(false)}
                    />
                )}

            {/* Footer Actions */}
            {saveError && (
                <div className="mx-6 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    {saveError}
                </div>
            )}
            <div className="border-t border-gray-200/60 bg-surface-light/50 px-6 py-4 dark:border-white/5 dark:bg-surface-dark/50">
                <div className="flex justify-end gap-2">
                    
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex items-center gap-1.5"
                    >
                        <Save size={14} />
                        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </section>
    );
}
