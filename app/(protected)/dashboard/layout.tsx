"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Flame,
  Heart,
  MessageCircle,
  Settings,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard/discover", icon: Flame, label: "Discover" },
  { href: "/dashboard/matches", icon: Heart, label: "Matches" },
  { href: "/dashboard/chat", icon: MessageCircle, label: "Chat" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--bg-main)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-[var(--border-color)] bg-[var(--card-bg)] p-4">
        <div className="mb-10 px-4 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block text-2xl font-black text-gradient italic tracking-tighter">
            SoulSync
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                    ? "bg-rose-500/10 text-rose-500"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "fill-rose-500/10" : "group-hover:scale-110 transition-transform"}`} />
                <span className={`hidden lg:block font-bold ${isActive ? "opacity-100" : "opacity-70"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-6 bg-rose-500 rounded-full hidden lg:block"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden glass h-16 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="text-rose-500 w-6 h-6" />
            <span className="text-xl font-black text-gradient italic tracking-tighter">
              SoulSync
            </span>
          </div>
          <button className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          <div className="max-w-4xl mx-auto pb-24 md:pb-6 md:pt-6 px-4 md:px-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden glass fixed bottom-0 left-0 right-0 h-20 flex justify-around items-center px-4 pb-4 z-50">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 w-full h-full"
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? "text-rose-500 -translate-y-1" : "text-[var(--text-secondary)]"
                  }`}>
                  <item.icon className={`w-7 h-7 ${isActive ? "fill-rose-500/5 rotate-12" : ""}`} />
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute -bottom-1 w-1 h-1 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
