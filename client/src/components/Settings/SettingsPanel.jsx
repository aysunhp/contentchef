import { useState } from "react";
import { Save, RotateCcw, Bell, Lock, Palette } from "lucide-react";

export default function SettingsPanel() {
    const [settings, setSettings] = useState({
        username: "Content Creator",
        email: "creator@example.com",
        bio: "Creating amazing content for my audience",
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

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        // Reset to defaults
        setSettings({
            username: "Content Creator",
            email: "creator@example.com",
            bio: "Creating amazing content for my audience",
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
        setSaved(false);
    };

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
                <div className="max-w-2xl space-y-8">
                    {/* Profile Section */}
                    <div className="rounded-2xl border border-gray-200/60 p-6 dark:border-white/10">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">
                                <span className="text-xl font-bold text-white">CC</span>
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

                    {/* Preferences Section */}
                    <div className="rounded-2xl border border-gray-200/60 p-6 dark:border-white/10">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                                <Palette size={18} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    Preferences
                                </h2>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    Customize your app experience
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="label-style">Theme</label>
                                <select
                                    value={settings.theme}
                                    onChange={(e) => handleChange("theme", e.target.value)}
                                    className="input-style"
                                >
                                    <option value="auto">Auto (System)</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>

                            <div>
                                <label className="label-style">Language</label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => handleChange("language", e.target.value)}
                                    className="input-style"
                                >
                                    <option value="english">English</option>
                                    <option value="spanish">Español</option>
                                    <option value="french">Français</option>
                                    <option value="german">Deutsch</option>
                                </select>
                            </div>

                            <div>
                                <label className="label-style">Default Post Format</label>
                                <select
                                    value={settings.defaultPostFormat}
                                    onChange={(e) => handleChange("defaultPostFormat", e.target.value)}
                                    className="input-style"
                                >
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div>
                                <label className="label-style">Default Post Status</label>
                                <select
                                    value={settings.defaultPostStatus}
                                    onChange={(e) => handleChange("defaultPostStatus", e.target.value)}
                                    className="input-style"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="review">Review</option>
                                </select>
                            </div>
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
                            <button className="w-full rounded-lg border border-gray-200/60 px-4 py-2 text-xs font-medium text-text-primary-light transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-text-primary-dark dark:hover:bg-white/5">
                                Change Password
                            </button>
                            <button className="w-full rounded-lg border border-gray-200/60 px-4 py-2 text-xs font-medium text-text-primary-light transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-text-primary-dark dark:hover:bg-white/5">
                                Enable Two-Factor Authentication
                            </button>
                            <button className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200/60 bg-surface-light/50 px-6 py-4 dark:border-white/5 dark:bg-surface-dark/50">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 rounded-xl border border-gray-200/60 px-4 py-2 text-xs font-medium text-text-secondary-light transition-colors hover:bg-gray-100 dark:border-white/10 dark:text-text-secondary-dark dark:hover:bg-white/5"
                    >
                        <RotateCcw size={14} />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary flex items-center gap-1.5"
                    >
                        <Save size={14} />
                        {saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </section>
    );
}
