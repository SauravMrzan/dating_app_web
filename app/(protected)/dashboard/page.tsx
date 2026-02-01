"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Home, Search, Flame, Map, Bell, 
  User as UserIcon, Heart, LogOut, Sun, Moon, 
  MessageCircle, Star, MapPin, Sparkles, ShieldCheck, CheckCircle2,
  Loader2, ChevronRight, Settings, Zap, Award, Target, Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { handleLogout } from '../../../lib/actions/auth-action'; 

import logoLight from '../../../public/logo2.png'; 
import logoDark from '../../../public/logo1.png';  

export default function DatingDashboard() {
  const { user, loading } = useAuth(); 
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState('discover');
  const [feedSection, setFeedSection] = useState<'nearby' | 'top-picks'>('nearby');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('dating-theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, mounted, router]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('dating-theme', newTheme);
  };

  const onLogout = async () => {
    try {
      await handleLogout();
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    } catch (error) {
      window.location.href = "/login";
    }
  };

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'User';

  if (!mounted || loading) {
    return (
      <div className={`h-screen w-full flex flex-col items-center justify-center gap-4 ${
        theme === 'dark' ? 'bg-[#0B0C10]' : 'bg-slate-50'
      }`}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="text-[#FF447C]" size={36} />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Finding your spark...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row h-screen transition-colors duration-300 relative overflow-hidden ${
      theme === "dark" ? "bg-[#0B0C10] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF447C]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5D44F8]/10 rounded-full blur-[120px]" />
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`w-full lg:w-72 border-b lg:border-b-0 lg:border-r p-6 flex flex-col z-10 backdrop-blur-xl ${
        theme === "dark" ? "border-white/10 bg-[#0F1116]/80" : "border-slate-200 bg-white/80"
      }`}>
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black italic tracking-tighter text-[#FF447C]">SPARK.</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <NavBtn icon={Home} label="Discover" active={activeTab === "discover"} onClick={() => setActiveTab("discover")} theme={theme} />
          <NavBtn icon={Flame} label="Trending" active={activeTab === "trending"} onClick={() => setActiveTab("trending")} theme={theme} />
          <NavBtn icon={MessageCircle} label="Messages" active={activeTab === "messages"} onClick={() => setActiveTab("messages")} theme={theme} />
          <NavBtn icon={Users} label="My Matches" active={activeTab === "matches"} onClick={() => setActiveTab("matches")} theme={theme} />
        </nav>

        <div className="pt-4 border-t space-y-4 mt-4 border-white/10">
           <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full py-4 bg-gradient-to-r from-[#FF447C] to-[#5D44F8] rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Find Matches</span>
          </motion.button>
        </div>
      </aside>

      {/* --- MAIN FEED --- */}
      <main className="flex-1 overflow-y-auto z-10 custom-scrollbar">
        <div className="max-w-2xl mx-auto py-8 px-6">
          <div className="flex gap-8 mb-8 border-b border-white/10">
            {["nearby", "top-picks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFeedSection(tab as any)}
                className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                  feedSection === tab ? "text-[#FF447C]" : "text-gray-500"
                }`}
              >
                {tab.replace("-", " ")}
                {feedSection === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF447C]" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
             <motion.div key={feedSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {feedSection === 'nearby' && <ProfileFeed theme={theme} />}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- PROFILE STATS --- */}
      <aside className={`w-80 p-6 hidden xl:flex flex-col gap-6 border-l z-10 ${
        theme === "dark" ? "bg-[#0F1116]/80 border-white/10" : "bg-white/80 border-slate-200"
      }`}>
        <div className={`rounded-3xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-[#FF447C] overflow-hidden">
               {user?.profilePicture ? (
                  <Image src={user.profilePicture} alt="Profile" fill className="object-cover" unoptimized />
               ) : (
                  <UserIcon size={40} className="m-6 text-gray-500" />
               )}
            </div>
            <div className="text-center">
              <h3 className="font-black uppercase italic tracking-tight">{user?.fullName || "Spark User"}</h3>
              <p className="text-[9px] text-[#FF447C] font-black uppercase tracking-widest mt-1">Premium Member</p>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
            <Zap size={14} className="text-[#FF447C]" /> Profile Strength
          </h4>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-gradient-to-r from-[#FF447C] to-[#5D44F8]" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">85% Complete - Add a bio!</p>
        </div>
        
        <button onClick={onLogout} className="mt-auto flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
          <LogOut size={14} /> Logout
        </button>
      </aside>
    </div>
  );
}

function NavBtn({ icon: Icon, label, active, onClick, theme }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${
      active ? 'bg-[#FF447C] text-white shadow-lg' : theme === 'dark' ? 'text-gray-500 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'
    }`}>
      <Icon size={18} />
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ProfileFeed({ theme }: { theme: 'light' | 'dark' }) {
  const matches = [
    { name: "Sarah", age: 24, dist: "2 miles away", bio: "Art lover, traveler, and coffee enthusiast. Looking for someone to explore the city with!", match: 98 },
    { name: "Marcus", age: 27, dist: "5 miles away", bio: "Weekend hiker and amateur chef. Let's cook something amazing together.", match: 85 },
  ];

  return (
    <div className="space-y-6">
      {matches.map((m, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[32px] border transition-all ${
            theme === 'dark' ? 'bg-[#16181D] border-white/10' : 'bg-white border-slate-200 shadow-md'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-2xl font-black italic tracking-tighter">{m.name}, {m.age}</h4>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                <MapPin size={12} className="text-[#FF447C]" /> {m.dist}
              </div>
            </div>
            <div className="px-4 py-2 bg-[#FF447C]/10 rounded-full border border-[#FF447C]/20">
              <span className="text-[#FF447C] text-[10px] font-black">{m.match}% Match</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{m.bio}</p>
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-[#FF447C] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform">
              Send Spark
            </button>
            <button className={`p-3 rounded-2xl border ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
              <MessageCircle size={20} className="text-gray-400" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}