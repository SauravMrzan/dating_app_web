"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Settings,
  MessageCircle,
  User as UserIcon,
  Heart,
  RotateCcw,
  X,
  Star,
  Zap,
  MapPin,
  Info,
  CheckCircle2,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Your specific logo path
import myLogo from "../../../public/images/logoright.png";

export default function DatingDashboard() {
  const { user, loading, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("dating-theme") as "light" | "dark";
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Client-side protection
  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, mounted, router]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("dating-theme", newTheme);
  };

  if (!mounted || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#111418]">
        <Loader2 className="text-[#FF447C] animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-full flex overflow-hidden transition-colors duration-500 ${
        theme === "dark" ? "bg-[#111418] text-white" : "bg-[#F0F2F5] text-slate-900"
      }`}
    >
      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={`hidden lg:flex flex-col w-[380px] border-r transition-colors ${
          theme === "dark" ? "bg-[#1A1D23] border-white/5" : "bg-white border-slate-200"
        }`}
      >
        {/* HEADER: Logo and Settings on the same horizon */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 min-h-[90px]">
          <div className="flex items-center">
            <Image
              src={myLogo}
              alt="App Logo"
              width={150}
              height={50}
              className="object-contain"
              priority
            />
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/5 transition-all opacity-60 hover:opacity-100"
          >
            <Settings size={22} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex gap-4 mb-8">
            <button className="flex-1 py-2.5 rounded-full bg-[#FF447C] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#FF447C]/20">
              Matches
            </button>
            <button className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${
              theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-500'
            }`}>
              Messages
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`aspect-[3/4] rounded-2xl border relative overflow-hidden group cursor-pointer transition-all ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* User Mini-Profile/Logout Section */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF447C] to-[#5D44F8] p-[2px]">
                 <div className="w-full h-full rounded-full bg-[#1A1D23] flex items-center justify-center overflow-hidden">
                    <UserIcon size={20} className="text-gray-400" />
                 </div>
              </div>
              <p className="text-xs font-bold truncate max-w-[120px]">{user?.fullName || "My Profile"}</p>
           </div>
           <button onClick={logout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut size={18} />
           </button>
        </div>
      </aside>

      {/* --- MAIN SWIPING AREA --- */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 bg-transparent">
        
        {/* Mobile Header with Logo */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center lg:hidden z-50">
          <Image src={myLogo} alt="Logo" width={100} height={40} className="object-contain" />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Tinder-Style Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative w-full max-w-[420px] aspect-[2/3] rounded-[40px] overflow-hidden shadow-2xl border transition-colors ${
            theme === "dark" ? "bg-[#24272D] border-white/10 shadow-black/50" : "bg-white border-slate-200 shadow-slate-300"
          }`}
        >
          {/* Card Visual Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
             <UserIcon size={80} className="text-white/10" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-extrabold tracking-tighter">Jessica</h2>
              <span className="text-3xl font-light opacity-80 italic">22</span>
              <CheckCircle2 size={24} className="text-blue-400" />
            </div>
            <p className="text-sm opacity-70 flex items-center gap-2 mb-8 font-semibold tracking-wide">
              <MapPin size={16} className="text-[#FF447C]" /> 5 MILES AWAY
            </p>
            <div className="flex flex-wrap gap-2">
              {["TRAVEL", "SUSHI", "NETFLIX"].map((t) => (
                <span
                  key={t}
                  className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl text-[9px] font-black tracking-[0.15em] border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          
          <button className="absolute top-8 right-8 z-20 w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-transform">
            <Info size={22} />
          </button>
        </motion.div>

        {/* Tinder Action Buttons */}
        <div className="mt-10 flex items-center gap-4">
          <CircleBtn icon={RotateCcw} color="text-yellow-500" size="sm" />
          <CircleBtn icon={X} color="text-red-500" size="lg" />
          <CircleBtn icon={Star} color="text-blue-400" size="sm" />
          <CircleBtn icon={Heart} color="text-[#00FFA3]" size="lg" />
          <CircleBtn icon={Zap} color="text-purple-500" size="sm" />
        </div>
      </main>
    </div>
  );
}

// Reusable Action Button Component
function CircleBtn({ icon: Icon, color, size }: any) {
  const s = size === "lg" ? "w-16 h-16" : "w-12 h-12";
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      className={`${s} rounded-full bg-[#1A1D23] border border-white/5 flex items-center justify-center shadow-xl ${color} hover:border-white/20 transition-colors z-20`}
    >
      <Icon size={size === "lg" ? 30 : 20} strokeWidth={size === 'lg' ? 3 : 2.5} />
    </motion.button>
  );
}

// Added missing Icon import
import { LogOut } from 'lucide-react';