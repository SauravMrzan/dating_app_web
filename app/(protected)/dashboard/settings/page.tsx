"use client";

import axios from "@/lib/api/axios";
import { clearAuthCookies } from "@/lib/cookie";
import { AppTheme, getStoredTheme, setTheme } from "@/lib/theme";
import { useEffect, useState } from "react";
import {
  LogOut,
  Trash2,
  Moon,
  Sun,
  ChevronRight,
  Sparkles
} from "lucide-react";

type SettingsItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  dangerous?: boolean;
};

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setThemeState] = useState<AppTheme>("light");

  useEffect(() => {
    const currentTheme =
      getStoredTheme() ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setThemeState(currentTheme);
  }, []);

  const logout = async () => {
    await clearAuthCookies();
    window.location.href = "/login";
  };

  const deleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you absolutely sure? This will permanently erase your profile, matches, and messages.",
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await axios.delete("/api/user/delete");
      alert("Your account has been successfully deleted.");
      await clearAuthCookies();
      window.location.href = "/login";
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to delete account");
      } else {
        alert("Failed to delete account");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const selectTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    setThemeState(nextTheme);
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-(--text-secondary) px-2">
        {title}
      </h3>
      <div className="card-premium overflow-hidden border-none shadow-lg shadow-black/5">
        {children}
      </div>
    </div>
  );

  const Item = ({ icon: Icon, label, onClick, dangerous }: SettingsItemProps) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 bg-(--card-bg) hover:bg-(--bg-secondary) transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 ${dangerous ? "bg-rose-500/10 text-rose-700" : "bg-gray-500/10 text-(--text-main)"} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-bold text-sm ${dangerous ? "text-rose-700" : "text-(--text-main)"}`}>
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-(--text-secondary) group-hover:text-(--text-main) group-hover:translate-x-1 transition-all" />
    </button>
  );

  return (
    <div className="max-w-md mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="pt-4 text-center">
        <h2 className="text-4xl font-black text-gradient italic tracking-tighter mb-2">Settings</h2>
        <p className="text-(--text-secondary) font-medium">Manage your soul connection experience.</p>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-8">
        <Section title="Preferences">
          <Item icon={Moon} label="Appearance" />
          <div className="px-5 pb-5">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-(--bg-secondary) p-1">
              <button
                onClick={() => selectTheme("light")}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                  theme === "light"
                    ? "bg-(--card-bg) text-(--text-main)"
                    : "text-(--text-secondary) hover:text-(--text-main)"
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => selectTheme("dark")}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                  theme === "dark"
                    ? "bg-(--card-bg) text-(--text-main)"
                    : "text-(--text-secondary) hover:text-(--text-main)"
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
            </div>
          </div>
        </Section>

        <Section title="Account Actions">
          <Item icon={LogOut} label="Sign Out" onClick={logout} />
          <div className="h-px bg-(--border-color) mx-5" />
          <Item
            icon={Trash2}
            label={isDeleting ? "Deleting..." : "Delete Account"}
            dangerous
            onClick={deleteAccount}
          />
        </Section>
      </div>

      {/* Footer */}
      <div className="text-center pt-10 opacity-30 group hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-3 h-3" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">SoulSync v2.0</p>
        </div>
        <p className="text-[9px] font-bold italic">Handcrafted with passion for modern love</p>
      </div>
    </div>
  );
}
