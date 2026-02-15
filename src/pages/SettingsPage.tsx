import { useState, useCallback } from "react";
import { User, Bell, Trash2, Shield, Save } from "lucide-react";
import { useUserStore } from "../store/useUserStore";

// --- Toggle Switch ---
interface ToggleProps {
    label: string;
    enabled: boolean;
    onToggle: () => void;
}

function Toggle({ label, enabled, onToggle }: ToggleProps) {
    return (
        <label className="flex cursor-pointer items-center justify-between py-3">
            <span className="text-sm font-medium text-slate-300">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    enabled ? "bg-emerald-500" : "bg-slate-600"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                        enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </label>
    );
}

// --- Section wrapper ---
interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                {icon}
                {title}
            </h2>
            {children}
        </div>
    );
}

// --- Page ---
export default function SettingsPage() {
    // Store
    const { name: storedName, email: storedEmail, notifications, sound, updateProfile, toggleNotifications, toggleSound } = useUserStore();

    // Local draft state for form inputs
    const [draftName, setDraftName] = useState(storedName);
    const [draftEmail, setDraftEmail] = useState(storedEmail);
    const [saved, setSaved] = useState(false);

    // Danger zone
    const [confirming, setConfirming] = useState(false);

    const handleSave = useCallback(() => {
        updateProfile(draftName, draftEmail);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }, [draftName, draftEmail, updateProfile]);

    const handleClearAll = useCallback(() => {
        if (!confirming) {
            setConfirming(true);
            return;
        }
        localStorage.clear();
        window.location.reload();
    }, [confirming]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Settings
                    </h1>
                    <p className="mt-1 text-slate-400">
                        Manage your profile, preferences, and data
                    </p>
                </div>

                <div className="space-y-6">
                    {/* ── Section 1: Profile ── */}
                    <Section
                        icon={<User className="h-5 w-5 text-emerald-400" />}
                        title="Profile"
                    >
                        {/* Avatar */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">{storedName || "—"}</p>
                                <p className="text-xs text-slate-500">Pro Account</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="settings-name"
                                    className="mb-1 block text-sm font-medium text-slate-300"
                                >
                                    Name
                                </label>
                                <input
                                    id="settings-name"
                                    type="text"
                                    value={draftName}
                                    maxLength={60}
                                    onChange={(e) => setDraftName(e.target.value)}
                                    className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Email (disabled) */}
                            <div>
                                <label
                                    htmlFor="settings-email"
                                    className="mb-1 block text-sm font-medium text-slate-300"
                                >
                                    Email
                                </label>
                                <input
                                    id="settings-email"
                                    type="email"
                                    value={draftEmail}
                                    maxLength={120}
                                    onChange={(e) => setDraftEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Save button */}
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-500 active:scale-[0.98]"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                            {saved && (
                                <span className="text-sm text-emerald-400 animate-pulse">
                                    Profile updated!
                                </span>
                            )}
                        </div>
                    </Section>

                    {/* ── Section 2: Preferences ── */}
                    <Section
                        icon={<Bell className="h-5 w-5 text-emerald-400" />}
                        title="Preferences"
                    >
                        <div className="divide-y divide-slate-700/40">
                            <Toggle
                                label="Push Notifications"
                                enabled={notifications}
                                onToggle={toggleNotifications}
                            />
                            <Toggle
                                label="Sound Effects"
                                enabled={sound}
                                onToggle={toggleSound}
                            />
                        </div>
                    </Section>

                    {/* ── Section 3: Data Management ── */}
                    <Section
                        icon={<Shield className="h-5 w-5 text-red-400" />}
                        title="Data Management"
                    >
                        <p className="mb-4 text-sm text-slate-400">
                            This will permanently delete all saved portfolio data and
                            reset the application to its default state. This action
                            cannot be undone.
                        </p>

                        <button
                            type="button"
                            onClick={handleClearAll}
                            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium transition active:scale-[0.98] ${
                                confirming
                                    ? "bg-red-600 text-white hover:bg-red-500"
                                    : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            }`}
                        >
                            <Trash2 className="h-4 w-4" />
                            {confirming ? "Confirm — Erase Everything" : "Clear All Data"}
                        </button>

                        {confirming && (
                            <button
                                type="button"
                                onClick={() => setConfirming(false)}
                                className="ml-3 text-sm text-slate-500 underline underline-offset-2 transition hover:text-slate-300"
                            >
                                Cancel
                            </button>
                        )}
                    </Section>
                </div>
            </div>
        </div>
    );
}
