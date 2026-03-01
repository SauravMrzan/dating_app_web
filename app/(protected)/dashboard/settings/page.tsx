"use client";

import axios from "@/lib/api/axios";
import { clearAuthCookies } from "@/lib/cookie";
import { useState } from "react";
import {
  LogOut,
  Trash2,
  Lock,
  ShieldCheck,
  Bell,
  Moon,
  Smartphone,
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch (error: any) {
      alert(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetPassword = () => {
    window.location.href = "/forgot-password";
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] px-2">
        {title}
      </h3>
      <div className="card-premium overflow-hidden border-none shadow-lg shadow-black/5">
        {children}
      </div>
    </div>
  );

  const Item = ({ icon: Icon, label, color, onClick, dangerous }: any) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 ${dangerous ? "bg-rose-500/10 text-rose-500" : "bg-gray-500/10 text-[var(--text-main)]"} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-bold text-sm ${dangerous ? "text-rose-500" : "text-[var(--text-main)]"}`}>
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-main)] group-hover:translate-x-1 transition-all" />
    </button>
  );

  return (
    <div className="max-w-md mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="pt-4 text-center">
        <h2 className="text-4xl font-black text-gradient italic tracking-tighter mb-2">Settings</h2>
        <p className="text-[var(--text-secondary)] font-medium">Manage your soul connection experience.</p>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-8">
        <Section title="Security & Privacy">
          <Item icon={Lock} label="Update Password" onClick={resetPassword} />
          <div className="h-[1px] bg-[var(--border-color)] mx-5" />
          <Item icon={ShieldCheck} label="Privacy Controls" />
        </Section>

        <Section title="Preferences">
          <Item icon={Bell} label="Notifications" />
          <div className="h-[1px] bg-[var(--border-color)] mx-5" />
          <Item icon={Moon} label="Appearance" />
          <div className="h-[1px] bg-[var(--border-color)] mx-5" />
          <Item icon={Smartphone} label="App Settings" />
        </Section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] px-2">
            SoulSync Community
          </h3>
          <div className="card-premium p-6 bg-gradient-primary text-white flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-black text-lg italic leading-none">SoulSync Gold</h4>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">See who likes you!</p>
            </div>
            <button className="bg-white text-rose-500 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 transition-transform">
              Upgrade
            </button>
          </div>
        </section>

        <Section title="Account Actions">
          <Item icon={LogOut} label="Sign Out" onClick={logout} />
          <div className="h-[1px] bg-[var(--border-color)] mx-5" />
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
